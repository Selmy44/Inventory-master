const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('./env.js');
const util = require('util');
const { error } = require("console");

const port = process.env.PORT || 5500;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.json());

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "inventorynew",
});

const query = util.promisify(db.query).bind(db);

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID:', connection.threadId);
});
//-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"]
  },
  debug: true
});

io.on("connection", (socket) => {

  socket.on("Employee_Message_Supervisor(1)", async (messageData) => {

    console.log("From employee: to supervisor", messageData);

    const getEmployeeID = (employeeName) => {
      return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM employees WHERE username = ?`;
        db.query(sql, [employeeName], (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            const employeeID = result.length > 0 ? result[0].id : null;
            // console.log("Employee ID", employeeID);
            resolve(employeeID);
          }
        });
      });
    };

    const getItemID = (itemName) => {
      return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM item WHERE name = ?`;
        db.query(sql, [itemName], (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            const itemID = result.length > 0 ? result[0].id : null;
            // console.log("Item ID", itemID);
            resolve(itemID);
          }
        });
      });
    };

    const getCategoryID = (categoryName) => {
      return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM category WHERE category_name = ?`;
        db.query(sql, [categoryName], (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            const categoryName = result.length > 0 ? result[0].id : null;
            // console.log("Item ID", categoryName);
            resolve(categoryName);
          }
        });
      });
    }

    try {
      const gotEmployeeName = messageData.employeeName;
      const employeeID = await getEmployeeID(gotEmployeeName);

      const gotItemName = messageData.itemName;
      const itemID = await getItemID(gotItemName);

      const gotCategoryName = messageData.categoryName;
      const categoryID = await getCategoryID(gotCategoryName);

      const status = 'Pending'

      const email = messageData.email;

      const priority = messageData.priority;

      const supervisorID = messageData.supervisor

      const q =
        "INSERT INTO employee_supervisor_request ( categoryID,	itemID,	employeeID,	description,	date_of_request, email,	status,	amount, priority, supervisor_concerned ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
      const values = [categoryID, itemID, employeeID, messageData.description, messageData.date, email, status, messageData.count, priority, supervisorID];

      db.query(q, values, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          id = data.insertId;
          // return id;
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  socket.on("Show Some", (sender) => {
    console.log(sender);
  })

  socket.on("HandleDelete", (object) => {
    console.log("Object Shown", object);
  })

  app.get('/get-notifications', (req, res) => {
    const sql = `SELECT 
    employees.username AS employee_username, 
    supervisor.username AS supervisor_username,
    supervisor_hr_request.amount, 
    supervisor_hr_request.description, 
    supervisor_hr_request.date_approved, 
    supervisor_hr_request.id, 
    supervisor_hr_request.supervisorID,
    supervisor_hr_request.email,
    supervisor_hr_request.status,
    supervisor_hr_request.priority,
    category.category_name,
    item.name
FROM 
    supervisor_hr_request
JOIN 
    employees ON supervisor_hr_request.employeeID = employees.id
JOIN 
    employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
JOIN 
    category ON supervisor_hr_request.categoryID = category.id
JOIN 
    item ON supervisor_hr_request.itemID = item.id
   -- WHERE supervisor_hr_request.status = 'Pending'
ORDER BY 
    supervisor_hr_request.id DESC;
 `
    db.query(sql, (error, result) => {
      if (error) {
        console.error("Error", error);
      } else {
        // console.log("ZATA: ", result);
        return res.json(result);
        // return res.json(result);
      }
    });
  })

  socket.on('/get-some', () => {

    try {
      const sql = `SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount, employee_supervisor_request.description, employee_supervisor_request.date_of_request, employee_supervisor_request.id, employee_supervisor_request.status 
      FROM employee_supervisor_request
      JOIN employees ON employee_supervisor_request.employeeID = employees.id
      JOIN category ON employee_supervisor_request.categoryID = category.id
      JOIN item ON employee_supervisor_request.itemID = item.id
      ORDER BY employee_supervisor_request.id DESC;
      `;

      db.query(sql, (error, result) => {
        if (error) {
          console.error("Error", error);
        } else {
          // console.log("Result: ", result);
          socket.emit("give-some", result);
        }

      })
    } catch (error) {
      console.error("Error ", error)
    }
  })

  socket.on("Supervisor_Message_HR(1)", (messageData, supervisorName) => {
    console.log("From supervisor: to HR", messageData, supervisorName);
    console.log("TYPE OF message", typeof messageData);

    const follow = "Approved By Supervisor";

    const id = messageData.id;

    const sql = `UPDATE employee_supervisor_request SET status = ? WHERE id = ?`;

    const values = [follow, id];

    db.query(sql, values, (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });

    io.emit("Supervisor_Message_HR(2)", messageData, supervisorName)
  })

  socket.on("HR_Message_Stock(1)", (messageData, updatedNotification) => {
    console.log("From HR: to stockManager", messageData, updatedNotification);
    io.emit("HR_Message_Stock(2)", messageData, updatedNotification)
  });

  socket.on("Company Insert", (messageData) => {
    const status = "Issued";
    console.log("Things: ", messageData, status);

    const companyID = messageData.company;
    const itemID = parseInt(messageData.itemID);
    const amount = messageData.amount;
    const requestor = messageData.requestor;
    const date = new Date();

    console.log("item ID is: ", itemID)

    const sql = `INSERT INTO company_records (companyID,	itemID,	amount, employeeID,	status) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [companyID, itemID, amount, requestor, status], (error, result) => {
      // result ? console.log("Good: ", result) : console.error("Error: ", error);
    });
  });

  socket.on("Stock_Message_Employee(1)", (messageData) => {
    console.log("From HR: to stockManager", messageData);
    io.emit("Stock_Message_Employee(2)", ([messageData]))
  })

  socket.on("Denied_By_Either(1)", (messageData) => {
    console.log("Denied Request Info", messageData);
    io.emit("Denied_By_Either(2)", messageData);
  })


  socket.on("Approved_By_Either(1)", (MessageData) => {
    console.log("Data response from the admin: ", MessageData)
    io.emit("Approved_By_Either(2)", MessageData);
  });

  socket.on("Denied", (notifications, newStatus) => {
    console.log("Data response from Admin: ", notifications, newStatus);
    io.emit("Denied", notifications, newStatus);
  });

  socket.on("Take This", (messageData) => {
    console.log("Update Approved Is hit ");

    const id = messageData.id;

    const status = "Approved";

    const sql = `UPDATE employee_supervisor_request SET status = ? WHERE id = ?`;

    db.query(sql, [status, id], (error, result) => {
      if (error) {
        console.error("Error: ", error)
      } else {
        console.log("Status set Approved");
      }
    });
  });

  socket.on("Take this purchase", (messageData) => {
    console.log("Update Approved Is hit ");

    const id = messageData.id;

    const status = "Approved";

    const sql = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

    db.query(sql, [status, id], (error, result) => {
      if (error) {
        console.error("Error: ", error)
      } else {
        console.log("Status set Approved");
      }
    });
  })

  socket.on("change-status-approve", (messageData) => {
    console.log("Update status Is hit ");
    const id = messageData.id;

    const status = "Approved";

    const sql = `UPDATE supervisor_hr_request SET status = ? WHERE id = ?`;
    db.query(sql, [status, id], (error, result) => {
      if (error) {
        console.error("Error: ", error)
      } else {
        console.log("Status set Approved");
      };
    });
  });

  socket.on("change-status-approve-purchase", (messageData) => {
    console.log("Update status Is hit ");
    const id = messageData.id;

    const sql = `UPDATE supervisor_hr_purchase SET status = 'Approved' WHERE id = ?`;
    db.query(sql, [id], (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });
  })

  socket.on("change-status-deny", (messageData) => {
    console.log("Denied status Is hit");
    const id = messageData.id;

    const status = "Denied";

    const sql = `UPDATE supervisor_hr_request SET status = ? WHERE id = ?`;
    db.query(sql, [status, id], (error, result) => {
      if (error) {
        console.error("Error: ", error)
      } else {
        console.log("Status set Denied");
      };
    });
  });

  socket.on("change-status-deny-for-employee", (messageData) => {
    // console.log("~~~~~Change for employee Hit~~~~~");

    const id = messageData.id;
    const status = "Denied";

    const sqli = `UPDATE employee_supervisor_request SET status = ? WHERE id = ?`;

    db.query(sqli, [status, id], (error, result) => {
      if (error) {
        console.error("Error: ", error)
      } else {
        console.log("Status set Denied");
      };
    });
  });

  socket.on("Deny For Employee Purchase", (messageData) => {
    const id = messageData.id;

    const status = "Denied";

    const sqli = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

    db.query(sqli, [status, id], (error, result) => {
      result ? console.log("Updated Well") : console.error("Error: ", error);
    });
  })

  socket.on("Send Approved Email", (messageData) => {
    // console.log("Object to be sent", messageData);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    });

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const date = Date.now();
    const formatedDate = formatDate(date);

    const mailOption = {
      from: 'Centrika Inventory System',
      to: messageData.email,
      subject: 'Item Requested Approved',
      text: `Item you requested ${messageData.name} was successfully approved on ${formatedDate}`
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.error("Error", error)
      } else {
        const response = info;
      }
    })
  });

  socket.on("Send Approved Email Purchase", (messageData) => {
    console.log("Object to be sent", messageData);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    });

    const mailOption = {
      from: 'Centrika Inventory System',
      to: messageData.email,
      subject: 'Item Requested For Purchase Approved',
      text: `Item you requested for purchase: ${messageData.expenditure_line} was successful with amount ${messageData.amount}FRW approved on ${messageData.date} notify the administration for further details.`
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.error("Error: ", error)
      } else {
        const response = info;
      }
    })
  });

  app.post('/send-through-API', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const date_approved = req.body.date_approved;

    console.log("Object to be sent", email);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    });

    const mailOption = {
      from: 'Centrika Inventory System',
      to: email,
      subject: 'Item Requested For Purchase Approved',
      text: `Item you requested for purchase: ${name} was successfully approved on ${date_approved} notify the administration for further details.`
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.error("Error: ", error)
      } else {
        const response = info;
      }
    })
  })

  socket.on("Approve Leave Requested", (messageData) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    });

    const mailOption = {
      from: 'Centrika Inventory System',
      to: messageData.email,
      subject: 'Leave You Requested Was Approved',
      text: `
      Hello,

      Administration just approved your leave request of ${messageData.days_required} days. 

      Thank You.
      `
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.error("Error: ", error)
      } else {
        const response = info;
      }
    })

  })

  socket.on("disconnect", () => {
  });

  socket.on("Employee_Leave_Message_Supervisor(1)", (messageData) => {

    const empID = parseInt(messageData.empID);
    const email = messageData.email;
    const date_of_request = messageData.datee;
    const leave = messageData.leave;
    const roleID = parseInt(messageData.roleID);
    const endDate = messageData.endDate;
    const startDate = messageData.startDate;
    const daysRequired = messageData.daysRequired;
    const selectedSupervisor = messageData.selectedSupervisor;
    const description = "None";
    const status = 'Pending'

    const q = "INSERT INTO employee_leave_request (empID,	roleID,	`leave`, description,	date_of_request,	email,	supervisor_concerned,	startDate,	endDate,	daysRequired, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(q, [empID, roleID, leave, description, date_of_request, email, selectedSupervisor, startDate, endDate, daysRequired, status], (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });
  })
});

server.listen(5001, () => {
  console.log("Socket server is running on http://localhost:5001");
});

//-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Add your routes and other configurations below this line

app.post("/employee", (req, res) => {
  const department = req.body.departmentName;
  const role = req.body.roleName;

  const departmentID = parseInt(department, 10);
  const roleID = parseInt(role, 10);

  // 



  const status = 'ACTIVE';

  const query = "INSERT INTO employees (username, password, phoneNumber, address, roleID, departmentID, status, email, date_of_employment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values = [
    req.body.username,
    req.body.password,
    req.body.phoneNumber,
    req.body.address,
    roleID,
    departmentID,
    status,
    req.body.email,
    req.body.date_of_employment
  ];

  // console.log("DATAS: ", values);

  db.query(query, values, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json(result.insertId);
    };
  });
});

app.get('/get-latest-itemID', (req, res) => {
  const sql = `SELECT MAX(id) AS latest_id FROM item`;
  db.query(sql, (error, result) => {
    result ? res.json({ latest_id: result[0].latest_id }) : console.error("Error in fetching item latestid");
  })
})

app.post('/add-items', (req, res) => {

  const categoryId = req.body.category;

  // console.log("Category", categoryId);

  const supplierId = req.body.supplier;

  const intValue = parseInt(supplierId, 10);

  // console.log("Supplier", supplierId);

  const insertQuery = 'INSERT INTO item (name, supplierID, categoryID) VALUES (?, ?, ?)';

  const insertValues = [
    req.body.name || null,
    intValue,
    categoryId || null,
  ];

  // console.log("VALUES: ", insertValues)

  db.query(insertQuery, insertValues, (insertError, result) => {
    if (insertError) {
      console.error('Error adding item:', insertError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Item added successfully' });
  });
});

app.post('/add-serial-holder/:itemID/:serials/:depreciation_rate_holder/:state_of_item_holder', async (req, res) => {

  const serials = req.params.serials.split(','); // Split serials by commas
  const itemID = req.params.itemID;
  const depreciation_rate_holder = req.params.depreciation_rate_holder;
  const state_of_item_holder = req.params.state_of_item_holder;
  const status = 'In';

  // console.log("All ", itemID, depreciation_rate_holder, state_of_item_holder, status);


  const sql = "INSERT INTO serial_number (serial_number, state_of_item, depreciation_rate, itemID, status, taker, quantity ) VALUES (?,?,?,?,?,NULL,1)";

  serials.forEach((serial) => {
    db.query(sql, [serial.trim(), state_of_item_holder, depreciation_rate_holder, itemID, status], (error, result) => {
      if (!result) {
        console.error("Error: ", error);
      }
    });
  });

  res.status(200).send("Serial numbers inserted successfully");
});

app.delete('/delete-serial-item/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM serial_number WHERE id = ?`;

  db.query(sql, [id], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    }
  })
})

app.put("/employee/:id", (req, res) => {
  const empID = req.params.id;
  const roleName = req.body.roleName;
  const departmentName = req.body.departmentName;
  const username = req.body.username;
  const password = req.body.password;
  const address = req.body.address;
  const status = req.body.status;
  const email = req.body.email;

  // console.log("FROM BODY: ", empID);
  // console.log("FROM BODY: ", roleName);
  // console.log("FROM BODY: ", departmentName);
  // console.log("FROM BODY: ", username);
  // console.log("FROM BODY: ", password);
  // console.log("FROM BODY: ", status);
  // console.log("FROM BODY: ", email);
  // console.log("FROM BODY: ", address);

  function getRoleId(role) {
    const q = 'SELECT role_name FROM role WHERE id = ?'
    const value = [role];
    db.query(q, value, (error, result) => {
      if (error) {
        console.error("Error: ", error);
      } else {
        // console.log("Done", result);
        return result;
      }
    })
  }

  const q = "UPDATE employees SET username = ?, password = ?, address = ?,  roleID = ?, departmentID = ?, status = ?, email = ? WHERE id = ?";
  const values = [
    username,
    password,
    address,
    roleName,
    departmentName,
    status,
    email,
    empID
  ];
  db.query(q, values, (err, data) => {
    if (!result) {
      console.error("Error")
    }
  });
});

app.get('/employee-once/:id', (req, res) => {
  const empID = req.params.id;
  const q = ` SELECT
     employees.id, 
     employees.username, 
     employees.password, 
     employees.address, employees.profile_picture, 
     employees.roleID, 
     employees.departmentID, 
     employees.status,
     employees.date_of_employment, 
     employees.email, 
     role.role_name, 
     department.department_name 

     FROM employees

     JOIN role ON employees.roleID = role.id
     JOIN department ON employees.departmentID = department.id 

     WHERE employees.id = ?;
`
  db.query(q, [empID], (err, result) => {
    if (result) {
      res.json(result);
      // res.json({ date_of_employment: result[0].date_of_employment});
    } else {
      console.error("Error: ", err);
    };
  });
});

app.get('/employee-name/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT username FROM employees WHERE id = ?`;
  db.query(sql, [id], (error, result) => {
    result ? res.json(result[0]) : console.error("Error: ", error);
  })
})


app.get('/get-DOE/:ID', (req, res) => {

  const id = req.params.ID;

  const sql = `SELECT date_of_employment FROM employees WHERE id = ?`;

  db.query(sql, id, (error, result) => {
    if (result) {
      res.json(result[0]);
    } else {
      console.error("Error: ", error);
    }
  });
});


app.post('/login', (req, res) => {
  const sql = "SELECT * FROM employees WHERE username = ? and password = ? ";
  db.query(sql, [req.body.username, req.body.password], (err, result) => {
    if (err) {
      console.log("Error happ:", err);
      return res.json({ Message: "Error inside server", err });
    }
    if (result.length > 0) {
      const userID = result[0].id;
      const roleID = result[0].roleID;
      const email = result[0].email;

      req.session.username = result[0].username;
      req.session.user_id = userID;
      req.session.role_id = roleID;
      req.session.email = email;

      console.log(req.session.username);

      return res.json({ Login: true, username: req.session.username, id: req.session.user_id, roleID: req.session.role_id, email: req.session.email })
    } else {
      return res.json({ Login: false });
    };
  });
});

app.get('/category', (req, res) => {
  const sql = 'SELECT * FROM category';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/employees', (req, res) => {
  const sql = ` SELECT employees.id, employees.username, employees.password, employees.profile_picture,employees.roleID, employees.address, employees.phoneNumber, employees.departmentID, employees.status, role.role_name,employees.email, department.department_name 
FROM 
employees 
JOIN role ON employees.roleID = role.id 
JOIN department ON employees.departmentID = department.id`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/employees-for-transaction/:ID', (req, res) => {

  const ID = req.params.ID;

  const sql = ` SELECT employees.id, employees.username, employees.address, employees.password, employees.profile_picture, employees.roleID, employees.departmentID, employees.status, role.role_name, employees.email, department.department_name 
FROM 
employees 
JOIN role ON employees.roleID = role.id 
JOIN department ON employees.departmentID = department.id
WHERE employees.id = ?
`;
  db.query(sql, [ID], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/items', (req, res) => {
  const categoryId = req.query.category;

  if (!categoryId) {
    res.status(400).json({ error: 'Category ID is required' });
    return;
  }

  const sql = `
      SELECT 
        item.*,
        category.category_name,
        supplier.first_name
      FROM 
        item
      JOIN 
        category ON item.categoryID = category.id
      JOIN 
        supplier ON item.supplierID = supplier.id
      WHERE 
        item.categoryID = ?`;

  db.query(sql, [categoryId], (err, results) => {

    err ? console.error("Error: ", err) : res.json(results);

  });
});

app.get('/number-category', (req, res) => {
  const sql = "SELECT COUNT(*) AS category_count FROM category";

  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    }

    // Check if result is not empty
    if (result && result.length > 0) {
      // Send the result back to the client
      res.json({ categoryCount: result[0].category_count });
    } else {
      res.status(500).send("Internal Server Error: No data returned from the database query");
    }
  });
});

app.get('/home-employee', (req, res) => {
  // console.log("Session", req.session.username);
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username });
  }
  else {
    return res.json({ valid: false })
  }
})

app.get('/number-item', (req, res) => {
  const sql = "SELECT COUNT(*) AS item_count FROM item";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ itemCount: result[0].item_count });
    }
  });
});

app.get('/number-employee', (req, res) => {
  const sql = "SELECT COUNT(*) AS employee_count FROM employees";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      res.json({ employeeCount: result[0].employee_count });
    }
  });
});

app.get('/number-request', (req, res) => {
  const sql = "SELECT COUNT(*) AS request_count FROM request_employee";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ requestCount: result[0].request_count });
    }
  });
});

app.get('/number-supplier', (req, res) => {
  const sql = "SELECT COUNT(*) AS supplier_count FROM supplier";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      // Send the result back to the client
      res.json({ supplierCount: result[0].supplier_count });
    }
  });
});

app.post('/category', (req, res) => {
  const q = 'INSERT INTO category (category_name, description) VALUES (?)';
  const values = [
    req.body.category_name,
    req.body.description
  ]
  db.query(q, [values], (err, data) => {
    if (err) {
      console.error("Error Inserting", err);
      return res.status(500).json({ error: "internal server error" })
    } else {
      // console.log("Supplier added well", data);
      return res.json(data)
    }
  })
})

app.post('/supplier', (req, res) => {
  const q = 'INSERT INTO supplier (first_name, address, phone, email, product, status) VALUES (?)';
  const values = [
    req.body.first_name,
    req.body.address,
    req.body.phone,
    req.body.email,
    req.body.product,
    req.body.status
  ]
  db.query(q, [values], (err, data) => {
    if (err) {
      console.error("Error inserting", err);
      return res.status(500).json({ error: "Internal Server Error" })
    } else {
      console.log("Supplier Number added well", data);
      return res.json(data)
    }
  })
})

app.get('/supplier', (req, res) => {
  const q = "SELECT * FROM supplier";
  db.query(q, (error, result) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).send("Internal Server Error");
    } else {
      res.json(result)
    }
  })
});

app.put('/supplier/:id', (req, res) => {
  const id = req.params.id;

  const query = `UPDATE supplier SET supplier first_name = ?, address = ?, phone = ?, email = ?, product = ?, status = ? WHERE id = ?`;

  const values = [
    req.body.first_name,
    req.body.address.
      req.body.phone,
    req.body.email,
    req.body.product,
    req.body.status,
    id
  ];
  // console.log("Values: ", values);
})

app.post('/add-serial-number/:takeItemID', (req, res) => {
  const itemID = req.params.takeItemID;
  const status = 'In';
  const q = "INSERT INTO serial_number (serial_number, state_of_item, depreciation_rate, itemID, status, taker, quantity ) VALUES (?,?,?,?,?,NULL,1)";
  const values = [
    req.body.serial_number,
    req.body.state_of_item,
    req.body.depreciation_rate,
    req.params.takeItemID,
    status
  ];

  // console.log("Data: ", values);

  db.query(q, values, (err, data) => {
    if (!data) {
      console.error("Error Occured When Inserting A New Serial Number:", err);
    }
  });
});

app.get('/get-serial-number/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  // console.log("ItemID: ", itemID);
  const q = `SELECT * FROM serial_number WHERE itemID = ? ORDER BY serial_number ASC;   `;

  db.query(q, [itemID], (error, result) => {
    if (result) {
      res.json(result);
    } else {
      console.error("Error: ", error);
    }
  });
});


app.get('/get-name-serial-number/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const q = `
  SELECT
    serial_number.*,
    item.name AS itemName
  FROM
    serial_number
  JOIN
    item ON serial_number.itemID = item.id
  WHERE
    serial_number.itemID = ?;
`;
  const values = [
    itemID
  ]
  db.query(q, [values], (err, result) => {
    if (err) {
      console.error('Error fetching item: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    return res.json(result);
  })
})

app.put('/update-item/:itemID', (req, res) => {
  const id = req.params.itemID;
  const newItemName = req.body.newItemName;
  const newSupplierID = req.body.newSupplierID;
  const newCategoryID = req.body.newCategoryID;
  const employeeUpdateName = req.body.employeeUpdateName;

  const date = new Date();

  const currentTimeString = date.toLocaleDateString();

  const updateQuery = 'UPDATE item SET name = ?, supplierID = ?, categoryID = ?, updatedtime = ?, nameUpdated	= ? WHERE id = ?';
  const updateValues = [newItemName, newSupplierID, newCategoryID, currentTimeString, employeeUpdateName, id];

  db.query(updateQuery, updateValues, (err3) => {
    if (err3) {
      console.error('Error updating item:', err3);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'Item updated successfully' });
  });
});


app.delete('/delete-item/:itemID', (req, res) => {
  const itemID = req.params.itemID;
  const q = `DELETE FROM item WHERE id = ?`;
  db.query(q, [itemID], (err, result) => {
    result ? res.json(result) : console.error("Error :", err);
  })
});

app.put('/update-serial-item/:id', (req, res) => {
  const id = req.params.id;
  // console.log("ID: ", id);
  const q = `UPDATE serial_number SET serial_number = ?, state_of_item = ?, depreciation_rate = ? WHERE id = ?`;
  const values = [
    req.body.serial_number,
    req.body.state_of_item,
    req.body.depreciation_rate,
    id
  ];

  db.query(q, values, (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    }
  });
});

app.put('/deactivate-employee/:id', (req, res) => {
  const id = req.params.id;
  const q = `UPDATE employees SET status = ? WHERE id = ?`;
  const deactivate = req.body.status;
  const values = [
    deactivate,
    id
  ]
  db.query(q, values, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      // console.log("Done did: ", result);
      // return result;
    }
  });
});

app.delete('/delete-employee/:id', (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM employees WHERE id = ?`;
  db.query(q, id, (error) => {
    if (error) {
      console.error("Error ", error)
    }
  })
})

app.get('/items/:categoryID', (req, res) => {
  const categoryID = req.params.categoryID;
  const q = 'SELECT * FROM item WHERE categoryID = ?';
  db.query(q, categoryID, (error, result) => {
    error ? console.error("Error: ", error) : res.json(result);
  })
});

app.get('/serial-number', (req, res) => {
  const q = 'SELECT * FROM serial_number';
  db.query(q, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      console.log("Type OF", typeof result);
      return res.json(result);
    }
  })
})

app.get('/get-total-number/:id', (req, res) => {
  const id = req.params.id;
  console.log('ID: ', id);
  const q = `SELECT * FROM serial_number WHERE itemID = ?`;
  db.query(q, id, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json({ totalCount: result.length });
    }
  });
});

app.put('/update-serial-status-return/:id/:status/:taker', (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  // const taker = req.params.taker;
  const taker = 0
  const amount_returned = 1;
  // console.log("Passed: ", id, status);
  const q = `UPDATE serial_number set status = ?, taker = ?, companyID = '0', returner = ?  WHERE id = ?`;
  const values = [status, taker, amount_returned, id]
  db.query(q, values, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      res.json("Successfully Updated!!!");
    };
  });
});

app.put('/update-serial-status/:IDTaken/:status/:taker', async (req, res) => {

  const id = req.params.IDTaken
  const status = req.params.status
  const taker = req.params.taker

  try {

    if (taker !== null) {

      const updateQuery = `UPDATE serial_number SET status = ?, taker = ?, quantity = GREATEST(quantity - 1, 0) WHERE id = ?`;
      const updateValues = [status, taker, id];

      db.query(updateQuery, updateValues, (error, updateResult) => {
        if (error) {
          console.error("Error", error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json("Successfully Updated!!!")
        };
      });
    } else {
      res.status(404).json({ error: "Taker not found" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.get('/monthly-report/:StartDate/:EndDate/:id', (req, res) => {
//   const start = req.params.StartDate;
//   const end = req.params.EndDate;
//   const idi = req.params.id;

//   console.log("Start from front: ", start);
//   console.log("end from front: ", end);
//   const query = `
//   SELECT 
//   DATE_FORMAT(serial_number.date, '%Y-%m-%d') AS transaction_date,
//   item.name AS item_name,
//   COALESCE(SUM(CASE WHEN serial_number.status = 'In' THEN 1 ELSE 0 END), 0) AS amount_entered,
//   COALESCE(SUM(CASE WHEN serial_number.status = 'Out' THEN 1 ELSE 0 END), 0) AS amount_went_out,
//   employees.username AS taker_name,
//   COALESCE((SELECT COUNT(*) FROM serial_number s WHERE s.status = 'In'  AND s.itemID = item.id), 0) AS total_items_in
// FROM serial_number
// JOIN item ON serial_number.itemID = item.id
// LEFT JOIN employees ON serial_number.taker = employees.id
// WHERE serial_number.date >= ? AND serial_number.date <= ? AND id = ? -- Specify your date range here
// GROUP BY transaction_date, item.name, employees.username, item.id
// ORDER BY serial_number.date DESC; -- Order by date in descending order

//   `;
//   const startDate = moment(req.query.start, 'DD-MM-YYYY').format('YYYY-MM-DD');
//   const endDate = moment(req.query.end, 'DD-MM-YYYY').format('YYYY-MM-DD');
//   const values = [start, end, idi];
//   db.query(query, values, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       console.log("Result: ", result);
//       res.json(result);
//     }
//   });
// });

app.get('/monthly-report/:StartDate/:EndDate', (req, res) => {

  const start = req.params.StartDate;
  const end = req.params.EndDate;

  // console.log("Start from front: ", start);
  // console.log("end from front: ", end);

  const query = `

 SELECT 
    item_transaction.id, 
    item_transaction.date, 
    item_transaction.action, 
    item_transaction.amount, 
    item_transaction.retour, 
    item_transaction.remaining ,
    company.CompanyName,
    item.name, 
    employees.username 
FROM 
    item_transaction
JOIN 
    item ON item_transaction.itemID = item.id
LEFT JOIN 
    employees ON item_transaction.requestor = employees.id
LEFT JOIN 
    company ON item_transaction.company = company.id
WHERE 
    item_transaction.date BETWEEN ? AND ?
ORDER BY 
    item_transaction.date DESC;


  `;
  const values = [start, end];
  db.query(query, values, (error, result) => {
    if (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result);
    }
  });
});

app.get('/get-item-transactions', (req, res) => {

  const sql = `SELECT 
    item_transaction.id, 
    item_transaction.date, 
    item_transaction.action, 
    item_transaction.amount, 
    item_transaction.retour, 
    item_transaction.remaining ,
    company.CompanyName,
    item.name, 
    employees.username 
FROM 
    item_transaction
JOIN 
    item ON item_transaction.itemID = item.id
LEFT JOIN 
    employees ON item_transaction.requestor = employees.id
LEFT JOIN 
    company ON item_transaction.company = company.id 
ORDER BY item_transaction.id DESC
     `;

  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})

app.delete('/delete-company/:ID', (req, res) => {
  const sql = `DELETE FROM company WHERE id = ? `;
  db.query(sql, [req.params.ID], (error, result) => {
    if (!result) {
      console.error("Error", error);
    }
  })
})

app.post('/take-one-daily-transaction/:itemID/:amount/:requestor/:status/:retour/:remaining/:companyID', (req, res) => {
  const date = new Date();
  const action = ''
  // console.log("Remaining: ", req.params.remaining);


  const formatDate = (dateString) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}_${month}_${day}`;
  };


  const sql = `INSERT INTO item_transaction ( itemID, amount, requestor, date, retour, action, remaining, company ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? ) `;
  db.query(sql, [req.params.itemID, req.params.amount, req.params.requestor, date, req.params.retour, req.params.status, req.params.remaining, req.params.companyID], (error, result) => {
    if (result) {
      // console.log("Request Recorded!!!");
      res.json('recorded');
    } else {
      console.error("Error: ", error);
    }
  });
});

app.get('/getor/:supervisorID', (req, res) => {
  const supervisorID = req.params.supervisorID

  const sql = `
  SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount,employee_supervisor_request.priority, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
  FROM employee_supervisor_request
  JOIN employees ON employee_supervisor_request.employeeID = employees.id
  JOIN category ON employee_supervisor_request.categoryID = category.id
  JOIN item ON employee_supervisor_request.itemID = item.id
 WHERE employee_supervisor_request.status = 'Pending' AND employee_supervisor_request.supervisor_concerned = ? 	
  ORDER BY employee_supervisor_request.id DESC;
  `;

  db.query(sql, [supervisorID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})

app.get('/getor-leave-supervisor/:supervisorID', (req, res) => {
  const supervisorID = req.params.supervisorID

  const sql = `
  SELECT
   employee_leave_request.id,
   employee_leave_request.leave,
   employee_leave_request.description,
   employee_leave_request.date_of_request,
   employee_leave_request.email,
   employee_leave_request.startDate,
   employee_leave_request.endDate,
   employee_leave_request.daysRequired,
   employee_leave_request.status,
   employee_leave_request.empID,
   employee_leave_request.status,
   employee_leave_request.roleID,
   employee_leave_request.supervisor_concerned AS supervisor_concerned_id,
   role.role_name,
   employees.username AS employeeName,
   supervisorConcerned.username AS supervisorConcerned

FROM employee_leave_request 

JOIN role ON employee_leave_request.roleID = role.id
JOIN employees ON employee_leave_request.empID = employees.id
JOIN employees AS supervisorConcerned ON employee_leave_request.supervisor_concerned = supervisorConcerned.id

WHERE supervisor_concerned = ? AND employee_leave_request.status = 'Pending'  ;
  `;

  db.query(sql, [supervisorID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})

app.get('/getor-leave-hr', (req, res) => {

  const sql = `
  SELECT
   supervisor_hr_leave_request.id,
   supervisor_hr_leave_request.leave,
   supervisor_hr_leave_request.description,
   supervisor_hr_leave_request.date_of_request,
   supervisor_hr_leave_request.email,
   supervisor_hr_leave_request.startDate,
   supervisor_hr_leave_request.endDate,
   supervisor_hr_leave_request.days_required,
   supervisor_hr_leave_request.status,
   supervisor_hr_leave_request.empID,
   supervisor_hr_leave_request.status,
   supervisor_hr_leave_request.roleID,
   supervisor_hr_leave_request.supervisorID AS supervisor_concerned_id,
   role.role_name,
   employees.username AS employeeName,
   supervisorConcerned.username AS supervisorConcerned

FROM supervisor_hr_leave_request 

JOIN role ON supervisor_hr_leave_request.roleID = role.id
JOIN employees ON supervisor_hr_leave_request.empID = employees.id
JOIN employees AS supervisorConcerned ON supervisor_hr_leave_request.supervisorID = supervisorConcerned.id

WHERE supervisor_hr_leave_request.status = 'Pending';
  `;

  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})

app.post('/add-department', (req, res) => {
  const q = 'INSERT INTO department(department_name, status) VALUES (?,?)';
  const values = [
    req.body.department_name,
    req.body.status
  ]
  db.query(q, values, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      // console.log("Done Well");
      return result;
    };
  });
});

app.post('/add-role/:deptID', async (req, res) => {
  try {
    const gotDepartmentName = req.params.deptID;
    console.log("DeptID", gotDepartmentName);
    const q = "INSERT INTO role(role_name, departmentID, status) VALUES(?, ?, ?)";
    const values = [req.body.roleName, gotDepartmentName, req.body.status];
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error", err);
      } else {
        res.status(200).send("Role successfully inserted");
      };
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.get('/get-department', (req, res) => {
  const q = 'SELECT * FROM department;';
  db.query(q, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      // console.log("Data", result);
      return res.json(result)
    }
  })
})

app.get('/employee', (req, res) => {
  const q = 'SELECT * FROM employees';
  db.query(q, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      console.log(result)
    }
  })
});

app.get('/get-role/:deptID', (req, res) => {
  const deptID = req.params.deptID;
  const q = `SELECT * FROM role WHERE departmentID = ?`;
  db.query(q, deptID, (error, result) => {
    if (error) {
      console.error("error", error);
    }
    return res.json(result);
  })
})



app.get('/get-request-employee-supervisor', async (req, res) => {

  try {

    const q =
      `SELECT
      e.username,
      c.category_name,
      i.name AS itemName,
      esr.description,
      esr.date_of_request AS date,
      esr.status,
      esr.amount
  FROM
      employee_supervisor_request esr
  JOIN
      employees e ON esr.employeeID = e.id
  JOIN
      category c ON esr.categoryID = c.id
  JOIN
      item i ON esr.itemID = i.id;
  ;
  `;

    db.query(q, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("data", data);
        return res.json(data);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.post('/add-request-supervisor-hr/:supervisorID', async (req, res) => {

  const getEmployeeID = (employeeName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM employees WHERE username = ?`;
      db.query(sql, [employeeName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const employeeID = result.length > 0 ? result[0].id : null;
          console.log("Employee ID", employeeID);
          resolve(employeeID);
        }
      });
    });
  };

  const getItemID = (itemName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM item WHERE name = ?`;
      db.query(sql, [itemName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const itemID = result.length > 0 ? result[0].id : null;
          console.log("Item ID", itemID);
          resolve(itemID);
        }
      });
    });
  };

  const getCategoryID = (categoryName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM category WHERE category_name = ?`;
      db.query(sql, [categoryName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const categoryName = result.length > 0 ? result[0].id : null;
          console.log("Item ID", categoryName);
          resolve(categoryName);
        }
      });
    });
  }

  try {
    const gotEmployeeName = req.body.username;
    const employeeID = await getEmployeeID(gotEmployeeName);
    console.log("Employee ID: ", employeeID);

    const gotItemName = req.body.name;
    const itemID = await getItemID(gotItemName);
    console.log("Item ID: ", itemID);

    const gotCategoryName = req.body.category_name;
    const categoryID = await getCategoryID(gotCategoryName);
    console.log("Category ID: ", categoryID);

    const status = 'Pending'

    const supervisorID = req.params.supervisorID;
    const email = req.body.email;
    const priority = req.body.priority;

    const q = "INSERT INTO supervisor_hr_request (supervisorID,employeeID,itemID,categoryID,description,date_approved,amount,email,status, priority) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
    const values = [supervisorID, employeeID, itemID, categoryID, req.body.description, req.body.date_of_request, req.body.amount, email, status, priority];
    console.log("Values: ", values);

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        // console.log(data);
        res.status(200).send("Request successfully inserted");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

app.put('/approve-by-supervisor/:index', (req, res) => {
  const id = req.params.index;
  const approve = "Approved";
  const values = [approve, id];
  const update1 = "UPDATE employee_supervisor_request set status = ? WHERE id = ?";

  db.query(update1, values, (error, result) => {
    if (error) {
      console.error("Error", error)
    } else {
      return result;
    }
  })
})

app.put('/deny-by-supervisor/:index', (req, res) => {
  const id = req.params.index;
  const approve = "Denied By Supervisor";
  const values = [approve, id];
  const update1 = "UPDATE employee_supervisor_request set status = ? WHERE id = ?";

  db.query(update1, values, (error, result) => {
    if (error) {
      console.error("Error", error)
    } else {
      console.log("Denied Well !!!");
      return result;
    }
  })
});

app.put('/deny-by-supervisor-purchase/:index', (req, res) => {
  const id = req.params.index;
  const approve = "Denied By Supervisor";
  const values = [approve, id];
  const update1 = "UPDATE employee_supervisor_purchase set status = ? WHERE id = ?";

  db.query(update1, values, (error, result) => {
    if (error) {
      console.error("Error", error)
    } else {
      console.log("Denied Well !!!");
      return result;
    }
  })
})

app.get('/get-number', (req, res) => {
  const sql = "SELECT id FROM employee_supervisor_request ORDER BY id DESC LIMIT 1";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const latestId = result[0].id;
        return res.json({ latestId });
      } else {
        return res.json({ latestId: null });
      }
    }
  });
});

app.get('/get-number-purchase', (req, res) => {
  const sql = "SELECT id FROM employee_supervisor_purchase ORDER BY id DESC LIMIT 1";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const latestId = result[0].id;
        return res.json({ latestId });
      } else {
        return res.json({ latestId: null });
      }
    }
  });
});

app.get('/get-number-trusted-suppliers', (req, res) => {
  const sql = "SELECT id FROM trustedsupplier ORDER BY id DESC LIMIT 1";
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const latestId = result[0].id;
        return res.json({ latestId });
      } else {
        return res.json({ latestId: null });
      }
    }
  });
});

app.get('/get-all-requests/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT item.name, category.category_name, employees.username, employee_supervisor_request.date_of_request, employee_supervisor_request.id,employee_supervisor_request.status
  FROM employee_supervisor_request
  JOIN item ON employee_supervisor_request.itemID = item.id
  JOIN employees ON employee_supervisor_request.supervisor_concerned = employees.id
  JOIN category ON employee_supervisor_request.categoryID = category.id
  WHERE employee_supervisor_request.employeeID = ?;
  `;
  db.query(sql, id, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      const response = result;
      return res.json(response);
    }
  })
})

app.delete('/delete', (req, res) => {
  const sql = "DELETE * FROM employee_supervisor_request WHERE employeeID = 6";
  db.query(sql, (error, result) => {
    // if (result) console.log("Done", result)
  })
})

app.get('/get-supervisor-name/:supervisorID', (req, res) => {
  const supervisorID = req.params.supervisorID;
  const sql = 'SELECT name FROM employees WHERE id = ?'
  db.query(sql, [supervisorID], (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      return res.json(result);
    };
  });
});

app.get('/get-supervisor', (req, res) => {
  const sql = 'SELECT * FROM employees WHERE roleID = 5'
  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error", error);
    } else {
      return res.json(result);
    };
  });
});

app.post('/post-by-hr', async (req, res) => {

  // console.log("Endpoint hit~~~!!!");

  const getEmployeeID = (employeeName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM employees WHERE username = ?`;
      db.query(sql, [employeeName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const employeeID = result.length > 0 ? result[0].id : null;
          resolve(employeeID);
        }
      });
    });
  };

  const getItemID = (itemName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM item WHERE name = ?`;
      db.query(sql, [itemName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const itemID = result.length > 0 ? result[0].id : null;
          resolve(itemID);
        }
      });
    });
  };

  const getCategoryID = (categoryName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM category WHERE category_name = ?`;
      db.query(sql, [categoryName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const categoryName = result.length > 0 ? result[0].id : null;
          resolve(categoryName);
        }
      });
    });
  };

  const getSupervisorID = (supervisorName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM employees WHERE username = ?`;
      db.query(sql, [supervisorName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const supervisorID = result.length > 0 ? result[0].id : null;
          resolve(supervisorID);
        }
      });
    });
  };

  const id = req.body.id;
  const itemName = req.body.name;
  const amount = req.body.amount;
  const description = req.body.description;
  const categoryName = req.body.category_name;
  const employeeName = req.body.employee_username;
  const supervisorName = req.body.supervisor_username;
  const email = req.body.email;

  const employee = await getEmployeeID(employeeName);
  const item = await getItemID(itemName);
  const category = await getCategoryID(categoryName);
  const supervisor = await getSupervisorID(supervisorName);

  const pending = "Not Issued";

  const sql = `INSERT INTO hr_admin_request (id,categoryID,itemID,amount,supervisorID,description,employeeID, email, stockStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )`;

  const values = [id, category, item, amount, supervisor, description, employee, email, pending];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("ERROR", error);
    } else {
      console.log(result)
    }
  })
})

app.post('/insert-doer/:itemID/:employeeID', (req, res) => {
  // console.log("Endpoint hit~~~~~");
  const itemID = req.params.itemID;
  const employeeID = req.params.employeeID;
  const action = "Updated";

  const sql = `INSERT INTO item_deletion_or_updation(itemID,employeeID,action) VALUES (?, ?, ?)`;

  const values = [itemID, employeeID, action];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error", error)
    }
  })
})

app.post('/insert-deletion-doer/:itemID/:employeeID', (req, res) => {
  // console.log("Endpoint hit~~~~~");
  const itemID = req.params.itemID;
  const employeeID = req.params.employeeID;
  const action = "Deleted";

  const sql = `INSERT INTO item_deletion_or_updation (itemID,employeeID,action) VALUES (?, ?, ?)`;

  const values = [itemID, employeeID, action];

  db.query(sql, values, (error, result) => {
    result ? res.json(result) : console.error("Error :", error);
  });
});

app.get('/get-action-transaction', (req, res) => {
  const get =
    `
    SELECT 
    item_deletion_or_updation.itemID AS item_id,
    item.name AS item_name,
    item_deletion_or_updation.employeeID AS employee_id,
    employees.username AS employee_username,
    item_deletion_or_updation.action 
FROM
    item_deletion_or_updation
LEFT JOIN
    item ON item_deletion_or_updation.itemID = item.id
LEFT JOIN
    employees ON item_deletion_or_updation.employeeID = employees.id
ORDER BY
    item_deletion_or_updation.id DESC;


   `;
  //  SELECT item.name, employees.username, item_deletion_or_updation.action
  // FROM item_deletion_or_updation
  // JOIN item ON item_deletion_or_updation.itemID = item.id
  // JOIN employees ON item_deletion_or_updation.employeeID = employees.id

  db.query(get, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      return res.json(result);
    }
  })
});

app.get('/get-approved-notification', (req, res) => {
  const q = ` SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount,employee_supervisor_request.priority, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
  FROM employee_supervisor_request
  JOIN employees ON employee_supervisor_request.employeeID = employees.id
  JOIN category ON employee_supervisor_request.categoryID = category.id
  JOIN item ON employee_supervisor_request.itemID = item.id
 WHERE employee_supervisor_request.status = 'Approved By Supervisor'
  ORDER BY employee_supervisor_request.id DESC;
`;
  db.query(q, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-approved-notification-leave-supervisor/:supervisorID', (req, res) => {
  const q = ` SELECT
   employee_leave_request.id,
   employee_leave_request.leave,
   employee_leave_request.description,
   employee_leave_request.date_of_request,
   employee_leave_request.email,
   employee_leave_request.startDate,
   employee_leave_request.endDate,
   employee_leave_request.daysRequired,
   employee_leave_request.empID,
   employee_leave_request.status,
   employee_leave_request.roleID,
   employee_leave_request.supervisor_concerned AS supervisor_concerned_id,
   role.role_name,
   employees.username AS employeeName,
   supervisorConcerned.username AS supervisorConcerned

FROM employee_leave_request 

JOIN role ON employee_leave_request.roleID = role.id
JOIN employees ON employee_leave_request.empID = employees.id
JOIN employees AS supervisorConcerned ON employee_leave_request.supervisor_concerned = supervisorConcerned.id

   
WHERE (employee_leave_request.status = 'Approved By Supervisor' OR employee_leave_request.status = 'Approved By HR') AND employee_leave_request.supervisor_concerned = ?;
  
`;
  db.query(q, [req.params.supervisorID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});


app.get('/get-approved-notification-leave-hr', (req, res) => {

  const q = `SELECT
   supervisor_hr_leave_request.id,
   supervisor_hr_leave_request.leave,
   supervisor_hr_leave_request.description,
   supervisor_hr_leave_request.date_of_request,
   supervisor_hr_leave_request.email,
   supervisor_hr_leave_request.startDate,
   supervisor_hr_leave_request.endDate,
   supervisor_hr_leave_request.days_required,
   supervisor_hr_leave_request.status,
   supervisor_hr_leave_request.empID,
   supervisor_hr_leave_request.status,
   supervisor_hr_leave_request.roleID,
   supervisor_hr_leave_request.supervisorID AS supervisor_concerned_id,
   role.role_name,
   employees.username AS employeeName,
   supervisorConcerned.username AS supervisorConcerned

FROM supervisor_hr_leave_request 

JOIN role ON supervisor_hr_leave_request.roleID = role.id
JOIN employees ON supervisor_hr_leave_request.empID = employees.id
JOIN employees AS supervisorConcerned ON supervisor_hr_leave_request.supervisorID = supervisorConcerned.id

WHERE supervisor_hr_leave_request.status = 'Approved';
`;
  db.query(q, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-denied-notification-leave-hr', (req, res) => {

  const q = `SELECT
   supervisor_hr_leave_request.id,
   supervisor_hr_leave_request.leave,
   supervisor_hr_leave_request.description,
   supervisor_hr_leave_request.date_of_request,
   supervisor_hr_leave_request.email,
   supervisor_hr_leave_request.startDate,
   supervisor_hr_leave_request.endDate,
   supervisor_hr_leave_request.days_required,
   supervisor_hr_leave_request.status,
   supervisor_hr_leave_request.empID,
   supervisor_hr_leave_request.status,
   supervisor_hr_leave_request.roleID,
   supervisor_hr_leave_request.supervisorID AS supervisor_concerned_id,
   role.role_name,
   employees.username AS employeeName,
   supervisorConcerned.username AS supervisorConcerned

FROM supervisor_hr_leave_request 

JOIN role ON supervisor_hr_leave_request.roleID = role.id
JOIN employees ON supervisor_hr_leave_request.empID = employees.id
JOIN employees AS supervisorConcerned ON supervisor_hr_leave_request.supervisorID = supervisorConcerned.id

WHERE supervisor_hr_leave_request.status = 'Denied';
`;
  db.query(q, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-approved-notification-employee/:employeeID', (req, res) => {
  const employeeID = req.params.employeeID;
  const q = ` SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
  FROM employee_supervisor_request
  JOIN employees ON employee_supervisor_request.employeeID = employees.id
  JOIN category ON employee_supervisor_request.categoryID = category.id
  JOIN item ON employee_supervisor_request.itemID = item.id
 WHERE (employee_supervisor_request.status = 'Approved' OR employee_supervisor_request.status'Approved By Supervisor') AND employee_supervisor_request.employeeID = ?
  ORDER BY employee_supervisor_request.id DESC;
`;
  db.query(q, [employeeID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-denied-notification', (req, res) => {
  const q = ` SELECT employees.username, category.category_name, item.name, employee_supervisor_request.priority, employee_supervisor_request.amount, employee_supervisor_request.priority, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
  FROM employee_supervisor_request
  JOIN employees ON employee_supervisor_request.employeeID = employees.id
  JOIN category ON employee_supervisor_request.categoryID = category.id
  JOIN item ON employee_supervisor_request.itemID = item.id
 WHERE employee_supervisor_request.status = 'Denied By Supervisor'
  ORDER BY employee_supervisor_request.id DESC;
`;
  db.query(q, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-denied-notification-leave-supervisor/:supervisorID', (req, res) => {
  const q = ` SELECT
   employee_leave_request.id,
   employee_leave_request.leave,
   employee_leave_request.description,
   employee_leave_request.date_of_request,
   employee_leave_request.email,
   employee_leave_request.startDate,
   employee_leave_request.endDate,
   employee_leave_request.daysRequired,
   employee_leave_request.empID,
   employee_leave_request.status,
   employee_leave_request.roleID,
   employee_leave_request.supervisor_concerned AS supervisor_concerned_id,
   role.role_name,
   employees.username AS employeeName,
   supervisorConcerned.username AS supervisorConcerned

FROM employee_leave_request 

JOIN role ON employee_leave_request.roleID = role.id
JOIN employees ON employee_leave_request.empID = employees.id
JOIN employees AS supervisorConcerned ON employee_leave_request.supervisor_concerned = supervisorConcerned.id

   
WHERE (employee_leave_request.status = 'Denied By Supervisor' OR employee_leave_request.status = 'Denied By HR') AND employee_leave_request.supervisor_concerned = ?;
`;
  db.query(q, [req.params.supervisorID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-denied-notification-purchase-employee/:employeeID', (req, res) => {
  const id = req.params.employeeID;
  const q = ` SELECT employees.username,employee_supervisor_purchase.expenditure_line, employee_supervisor_purchase.amount, employee_supervisor_purchase.cost_method, employee_supervisor_purchase.end_goal, employee_supervisor_purchase.priority, employee_supervisor_purchase.date, employee_supervisor_purchase.email, employee_supervisor_purchase.status
  FROM employee_supervisor_purchase
  JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
  WHERE (employee_supervisor_purchase.status = 'Denied' OR employee_supervisor_purchase.status = 'Denied By Supervisor') AND employee_supervisor_purchase.employeeID = ?
  ORDER BY employee_supervisor_purchase.id DESC;
`;
  db.query(q, [id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-denied-notification-purchase-supervisor/:supervisorID', (req, res) => {
  const id = req.params.supervisorID;
  const q = ` SELECT  employees.username,employee_supervisor_purchase.expenditure_line, employee_supervisor_purchase.amount, employee_supervisor_purchase.cost_method, employee_supervisor_purchase.end_goal, employee_supervisor_purchase.priority, employee_supervisor_purchase.date, employee_supervisor_purchase.email, employee_supervisor_purchase.status
  FROM employee_supervisor_purchase
  JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
  WHERE (employee_supervisor_purchase.status = 'Denied' OR employee_supervisor_purchase.status = 'Denied by supervisor') AND employee_supervisor_purchase.supervisor = ?
  ORDER BY employee_supervisor_purchase.id DESC;
`;
  db.query(q, [id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-pending-notifications', (req, res) => {

  const sql = `SELECT 
  employees.username AS employee_username, 
  supervisor.username AS supervisor_username,
  supervisor_hr_request.amount, 
  supervisor_hr_request.description, 
  supervisor_hr_request.date_approved, 
  supervisor_hr_request.id, 
  supervisor_hr_request.supervisorID,
  supervisor_hr_request.email,
  supervisor_hr_request.priority,
  supervisor_hr_request.status,
  category.category_name,
  item.name
FROM 
  supervisor_hr_request
JOIN 
  employees ON supervisor_hr_request.employeeID = employees.id
JOIN 
  employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
JOIN 
  category ON supervisor_hr_request.categoryID = category.id
JOIN 
  item ON supervisor_hr_request.itemID = item.id
  WHERE  supervisor_hr_request.status = 'Pending'
ORDER BY 
  supervisor_hr_request.id DESC;
`
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-approved-notifications', (req, res) => {

  const sql = `SELECT 
  employees.username AS employee_username, 
  supervisor.username AS supervisor_username,
  supervisor_hr_request.amount, 
  supervisor_hr_request.description, 
  supervisor_hr_request.date_approved, 
  supervisor_hr_request.id, 
  supervisor_hr_request.supervisorID,
  supervisor_hr_request.priority,
  supervisor_hr_request.email,
  supervisor_hr_request.status,
  category.category_name,
  item.name
FROM 
  supervisor_hr_request
JOIN 
  employees ON supervisor_hr_request.employeeID = employees.id
JOIN 
  employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
JOIN 
  category ON supervisor_hr_request.categoryID = category.id
JOIN 
  item ON supervisor_hr_request.itemID = item.id
  WHERE  supervisor_hr_request.status = 'Approved'
ORDER BY 
  supervisor_hr_request.id DESC;
`
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-denied-notifications', (req, res) => {

  const sql = `SELECT 
  employees.username AS employee_username, 
  supervisor.username AS supervisor_username,
  supervisor_hr_request.amount, 
  supervisor_hr_request.description, 
  supervisor_hr_request.date_approved, 
  supervisor_hr_request.id, 
  supervisor_hr_request.supervisorID,
  supervisor_hr_request.email,
  supervisor_hr_request.priority,
  supervisor_hr_request.status,
  category.category_name,
  item.name
FROM 
  supervisor_hr_request
JOIN 
  employees ON supervisor_hr_request.employeeID = employees.id
JOIN 
  employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
JOIN 
  category ON supervisor_hr_request.categoryID = category.id
JOIN 
  item ON supervisor_hr_request.itemID = item.id
  WHERE  supervisor_hr_request.status = 'Denied'
ORDER BY 
  supervisor_hr_request.id DESC;
`
  db.query(sql, (error, result) => {
    // console.log("TYPE OF RESULT: ", typeof result);
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/show-supervisor', (req, res) => {
  const q = `
  SELECT username, id
  FROM employees
  WHERE roleID = 5
  `;

  db.query(q, (error, data) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      return res.json(data);
    }
  })
});

app.delete('/delete-category/:id', (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM category
  WHERE id = ?;
  `;

  db.query(q, [id], (error, result) => {
    result ? console.log(result) : console.error("Error: ", error);
  })
});

app.post('/add-employee-supervisor-purchase', (req, res) => {

  const employeeID = req.body.employeeID;
  const expenditure_line = req.body.description;
  const amount = req.body.amount;
  const cost = req.body.cost;
  const supervisorID = req.body.supervisorID;
  const endGoal = req.body.endGoalValue;
  const quotation = req.body.file;
  const priority = req.body.priority;
  const email = req.body.email;
  const status = "Pending";

  const q = "INSERT INTO employee_supervisor_purchase (expenditure_line,amount,cost_method,supervisor,end_goal,priority,employeeID,email,status) VALUES (?,?,?,?,?,?,?,?,?)";

  const values = [
    expenditure_line,
    amount,
    cost,
    supervisorID,
    endGoal,
    priority,
    employeeID,
    email,
    status
  ]

  db.query(q, values, (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    }
  });
});

app.get('/get-purchase-notification/:supervisorID', (req, res) => {
  const id = req.params.supervisorID;
  const sql = ` SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method,employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
 FROM employee_supervisor_purchase
 JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
WHERE employee_supervisor_purchase.status = 'Pending' AND employee_supervisor_purchase.supervisor = ?
 ORDER BY employee_supervisor_purchase.id DESC `;

  const values = [id];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json(result);
      // console.log("Type of quotation: ", result[0].quotation);
    };
  })
});


app.get('/get-approved-purchase-notification/:supervisorID', (req, res) => {
  const id = req.params.supervisorID;
  const sql = `SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method,employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
  FROM employee_supervisor_purchase
  JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
  WHERE (employee_supervisor_purchase.status = 'Approved' OR employee_supervisor_purchase.status = 'Approved By Supervisor') AND employee_supervisor_purchase.supervisor = ?
  ORDER BY employee_supervisor_purchase.id DESC; `;

  const values = [id];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json(result);
    };
  })
});

app.get('/get-approved-purchase-notification-employee/:employeeID', (req, res) => {
  const id = req.params.employeeID;
  const sql = ` SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method, employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
 FROM employee_supervisor_purchase
 JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
WHERE (employee_supervisor_purchase.status = 'Approved By Supervisor' OR employee_supervisor_purchase.status = 'Approved') AND employee_supervisor_purchase.employeeID = ?
 ORDER BY employee_supervisor_purchase.id DESC `;

  const values = [id];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json(result);
    };
  })
});

app.get('/get-purchase-notification-employee/:employeeID', (req, res) => {
  const id = req.params.employeeID;
  const sql = ` SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method,employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
 FROM employee_supervisor_purchase
 JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
WHERE employee_supervisor_purchase.status = 'Pending' AND employee_supervisor_purchase.employeeID = ?
 ORDER BY employee_supervisor_purchase.id DESC `;

  const values = [id];
  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json(result);
    };
  })
});

app.get('/get-purchase-notification-hr', (req, res) => {
  const sql = `SELECT employees.username,supervisor_hr_purchase.amount,supervisor_hr_purchase.cost_method,supervisor_hr_purchase.expenditure_line,supervisor_hr_purchase.email,supervisor_hr_purchase.status, supervisor_hr_purchase.end_goal,supervisor_hr_purchase.quotation, supervisor_hr_purchase.quotation, supervisor_hr_purchase.priority,supervisor_hr_purchase.date ,supervisor_hr_purchase.date , supervisor_hr_purchase.id
  FROM supervisor_hr_purchase
  JOIN employees ON supervisor_hr_purchase.employeeID = employees.id
 WHERE supervisor_hr_purchase.status = 'Pending'
  ORDER BY supervisor_hr_purchase.id DESC;`;
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-approved-purchase-notification-hr', (req, res) => {
  const sql = `SELECT employees.username,supervisor_hr_purchase.amount,supervisor_hr_purchase.cost_method,supervisor_hr_purchase.expenditure_line,supervisor_hr_purchase.email,supervisor_hr_purchase.status, supervisor_hr_purchase.end_goal,supervisor_hr_purchase.quotation, supervisor_hr_purchase.quotation, supervisor_hr_purchase.priority,supervisor_hr_purchase.date ,supervisor_hr_purchase.date , supervisor_hr_purchase.id
  FROM supervisor_hr_purchase
  JOIN employees ON supervisor_hr_purchase.employeeID = employees.id
 WHERE supervisor_hr_purchase.status = 'Approved'
  ORDER BY supervisor_hr_purchase.id DESC;`;
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-denied-notification-purchase-hr', (req, res) => {
  const sql = `SELECT employees.username,supervisor_hr_purchase.amount,supervisor_hr_purchase.cost_method,supervisor_hr_purchase.expenditure_line,supervisor_hr_purchase.email,supervisor_hr_purchase.status, supervisor_hr_purchase.end_goal,supervisor_hr_purchase.quotation, supervisor_hr_purchase.quotation, supervisor_hr_purchase.priority,supervisor_hr_purchase.date ,supervisor_hr_purchase.date , supervisor_hr_purchase.id
  FROM supervisor_hr_purchase
  JOIN employees ON supervisor_hr_purchase.employeeID = employees.id
 WHERE supervisor_hr_purchase.status = 'Denied'
  ORDER BY supervisor_hr_purchase.id DESC;`;
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.put('/change-status/:id', (req, res) => {
  const id = req.params.id;

  const status = "Approved By Supervisor";

  const query = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

  const values = [status, id];

  db.query(query, values, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.post('/add-purchase-supervisor-hr/:supervisorID', async (req, res) => {

  const getEmployeeID = (employeeName) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id FROM employees WHERE username = ?`;
      db.query(sql, [employeeName], (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const employeeID = result.length > 0 ? result[0].id : null;
          resolve(employeeID);
        }
      });
    });
  };

  try {
    const gotEmployeeName = req.body.username;

    const employeeID = await getEmployeeID(gotEmployeeName);
    const status = 'Pending'

    const supervisorID = req.params.supervisorID;
    const email = req.body.email;
    const priority = req.body.priority;
    const expenditure = req.body.expenditure_line;
    const amount = req.body.amount;
    const cost_method = req.body.cost_method;
    const endGoal = req.body.end_goal;

    console.log("Email From Front: ", email);

    const q = "INSERT INTO supervisor_hr_purchase (expenditure_line, amount, cost_method, supervisor, end_goal, status, email, priority, employeeID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
      expenditure,
      amount,
      cost_method,
      supervisorID,
      endGoal,
      status,
      email,
      priority,
      employeeID
    ];

    console.log("Values: ", values);

    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).send("Request successfully inserted");
      };
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/get-purchase-id', (req, res) => {
  const q = `SELECT id FROM employee_supervisor_purchase ORDER BY id DESC LIMIT 1;`;
  db.query(q, (error, data) => {
    // console.log("Data: ", data);
    data ? res.json(data) : console.error("Error: ", error);
  })
});

app.get('/get-company-id', (req, res) => {
  const q = `SELECT id FROM company ORDER BY id DESC LIMIT 1`;
  db.query(q, (error, data) => {
    // console.log("Data: ", data);
    data ? res.json(data) : console.error("Error: ", error);
  })
});

app.get('/get-employee-id', (req, res) => {
  const q = `SELECT id FROM employees ORDER BY id DESC LIMIT 1;`;
  db.query(q, (error, data) => {
    // console.log("Data: ", data);
    data ? res.json(data) : console.error("Error: ", error);
  })
});

app.get('/get-trusted-supplier-id', (req, res) => {
  const q = `SELECT id FROM trustedsupplier ORDER BY id DESC LIMIT 1;`;
  db.query(q, (error, data) => {
    data ? res.json(data) : console.error("Error: ", error);
  })
});

app.get('/supplier/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM supplier WHERE id = ?";
  db.query(sql, [id], (error, data) => {
    data ? res.json(data) : console.error("Error: ", error);
  });
});

app.put('/approve-by-hr-purchase/:id', (req, res) => {

  const id = req.params.id;
  const status = "Approved";
  const values = [status, id];
  const query = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

  db.query(query, values, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.put('/deny-by-hr-purchase/:id', (req, res) => {
  const id = req.params.id;
  const query = `UPDATE supervisor_hr_purchase SET status = 'Denied' WHERE id = ?`;
  db.query(query, [id], (error, result) => {
    result ? console.log("Updated Well") : console.error("Error: ", error);
  });
});

const ssh = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCxKBPLSQ1E9SJG7podhvZjH3dP34GXWA5jW0i1jClVsSjN9BrByfKUeiq6E1KsdpXLmxXhMsrlNRugCKSnBfkIaDeobFackhkCv3v9O6KH6lPTHBbWMTT6Ah/5/8RQw5Xk4MOqmhvL6u0H8fJcDg7w3fRB/igSC1Irxe1DDjy/dCwMeAW8OJu4530FdIJ79F/7xWiEvlzx+bRbyaR8AwpBXZBQ/Wfox2frUxevW6ZXOYPu5eaT+UhMC5x4z+7HFl28d/OdDOfQLjgp1mghla/gHBr414qMKqlCWyyDIxpYNe4FjQVac7UUtRTP20ZIF/FL31GDGZOZ21j3yA34tib+yawIfrZa7f66Z1M/HiiPJcGGqoKJz5nddvIOl3F8An+ZyKJ3A2BcE8VnfowJ77WH3X3GN1vg6BpCpUkT/xzJge+U1wcK5bREDjpYeU1l5eo2eiHckjLh0W/jgU0YtGmVAnLBj/v/gxtVwMlnEZ22NrWODhCQDw+G2/xD0BF5Trs= cnziza@centrika-test02`;

app.get('/get-trusted-suppliers', (req, res) => {
  const q = ` SELECT * FROM trustedsupplier; `;

  db.query(q, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.post('/new-trusted-supplier', (req, res) => {
  const name = req.body.name;
  const dateEntered = req.body.dateEntered;
  const endEntered = req.body.endEntered;
  const product = req.body.product;
  const email = req.body.email;
  const address = req.body.address;

  const sql = "INSERT INTO trustedsupplier(name, date_entered, end_of_contract, product, email, address) VALUES (?, ?, ?, ?, ?, ? );";

  const values = [
    name,
    dateEntered,
    endEntered,
    product,
    email,
    address
  ];

  db.query(sql, values, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-one-trusted-supplier/:id', (req, res) => {

  const id = req.params.id;
  const sql = 'SELECT * FROM trustedSupplier WHERE id = ?';

  db.query(sql, [id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/trustedSuppliers-dates/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT date_entered , end_of_contract FROM trustedsupplier WHERE id = ?';
  db.query(sql, [id], (error, result) => {
    result ? res.json(result[0]) : console.error("Error: ", error);
  });
});



app.put('/change-status-from-notifications/:requestor/:item/:amount/:rowID', async (req, res) => {

  const requestor = req.params.requestor;
  const item = req.params.item;
  const requiredAmount = parseInt(req.params.amount);

  const getEmployeeID = (id) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT id FROM employees WHERE username = ?`;
      const value = [id];

      db.query(q, value, (error, result) => {
        if (error) {
          console.error("error", error);
          reject(error);
        } else {
          // console.log("Result", result);
          resolve(result[0].id);
        }
      });
    });
  };

  const getItemID = (id) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT id FROM item WHERE name = ?`;
      const value = [id];

      db.query(q, value, (error, result) => {
        if (error) {
          console.error("error", error);
          reject(error);
        } else {
          // console.log("Result", result);
          resolve(result[0].id);
        }
      });
    });
  };

  const requestorID = await getEmployeeID(requestor);

  const itemID = await getItemID(item);

  const getExactAmount = (itemID) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT COUNT(*) AS count FROM serial_number WHERE status = 'In' AND itemID = ?;`;
      const value = [itemID];

      db.query(q, value, (error, result) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
        } else {
          // console.log("", result);
          // Ensure that result is an array and has at least one element
          if (Array.isArray(result) && result.length > 0) {
            // Resolve with the count value
            resolve(result[0].count);
          } else {
            reject(new Error("No result found"));
          }
        }
      });
    });
  };

  const exactAmount = await getExactAmount(itemID);

  if (exactAmount >= requiredAmount) {

    const updateQuery = `UPDATE serial_number SET status = 'Out',  taker = ?  WHERE itemID = ? AND status = 'In' LIMIT ?;`;
    const updateValues = [requestorID, itemID, requiredAmount];

    db.query(updateQuery, updateValues, (error, result) => {
      result ? res.json("Given Out") : console.error("Error: ", error);
    });
  } else {
    res.json("Not enough items to give out.");
  }
});

app.put('/change-status-from-notifications-for-bulk/:employeeID/:item/:amount/:rowID', async (req, res) => {

  // console.log("HITTTT")

  const requestor = req.params.employeeID;
  const item = req.params.item;
  const companyID = req.params.rowID
  const requiredAmount = parseInt(req.params.amount);


  const getExactAmount = (item) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT COUNT(*) AS count FROM serial_number WHERE status = 'In' AND itemID = ?;`;
      const value = [item];

      db.query(q, value, (error, result) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
        } else {
          // console.log("Result", result);
          // Ensure that result is an array and has at least one element
          if (Array.isArray(result) && result.length > 0) {
            // Resolve with the count value
            resolve(result[0].count);
          } else {
            reject(new Error("No result found"));
          }
        }
      });
    });
  };

  const exactAmount = await getExactAmount(item);

  if (exactAmount >= requiredAmount) {

    const updateQuery = `UPDATE serial_number 
        SET status = 'Out', taker = ?, companyID = ? 
        WHERE itemID = ? 
        AND status = 'In' 
        ORDER BY serial_number ASC
        LIMIT ?;`;

    const updateValues = [requestor, companyID, item, requiredAmount];

    db.query(updateQuery, updateValues, (error, result) => {
      result ? res.json("Given Out") : console.error("Error: ", error);
    });
  } else {
    res.json("Not enough items to give out.");
  }
});

app.put('/change-status-from-notifications-for-bulkx', async (req, res) => {

  console.log("Called");

  const requestor = parseInt(req.body.requestor);
  const item = req.body.itemID;
  const companyID = parseInt(req.body.company);
  const requiredAmount = parseInt(req.body.amount);


  const getExactAmount = (item) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT COUNT(*) AS count FROM serial_number WHERE status = 'In' AND itemID = ?;`;
      const value = [item];

      db.query(q, value, (error, result) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
        } else {
          // console.log("Result:", result);
          // Ensure that result is an array and has at least one element
          if (Array.isArray(result) && result.length > 0) {
            // Resolve with the count value
            resolve(result[0].count);
          } else {
            reject(new Error("No result found"));
          }
        }
      });
    });
  };

  const exactAmount = await getExactAmount(item);

  if (exactAmount >= requiredAmount) {

    const updateQuery = `UPDATE serial_number 
        SET status = 'Out', taker = ?, companyID = ? 
        WHERE itemID = ? 
        AND status = 'In' 
        ORDER BY serial_number ASC
        LIMIT ?`;
    const updateValues = [requestor, companyID, item, requiredAmount];

    db.query(updateQuery, updateValues, (error, result) => {
      result ? res.json("Given Out") : console.error("Error: ", error);
    });
  } else {
    res.json("Not enough items to give out.");
  }
});

app.put('/change-status-from-notifications-for-company/:requestor/:item/:amount/:company', async (req, res) => {

  const requestor = req.params.requestor;
  const item = req.params.item;
  const company = req.params.company
  const requiredAmount = parseInt(req.params.amount);

  const getExactAmount = (itemID) => {
    return new Promise((resolve, reject) => {
      const q = `SELECT COUNT(*) AS count FROM serial_number WHERE status = 'In' AND itemID = ?;`;
      const value = [itemID];

      db.query(q, value, (error, result) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
        } else {
          // console.log("Result:", result);
          // Ensure that result is an array and has at least one element
          if (Array.isArray(result) && result.length > 0) {
            // Resolve with the count value
            resolve(result[0].count);
          } else {
            reject(new Error("No result found"));
          }
        }
      });
    });
  };

  const exactAmount = await getExactAmount(item);

  console.log("Got exact amount: ", exactAmount)

  if (exactAmount >= requiredAmount) {

    // console.log("Entered Giving Out Process!!!")

    const updateQuery = `UPDATE serial_number SET status = 'Out',  taker = ?, companyID = ?  WHERE itemID = ? AND status = 'In' LIMIT ?;`;
    const updateValues = [requestor, company, item, requiredAmount];
    // console.log("Given Out!!");
    db.query(updateQuery, updateValues, (error, result) => {
      result ? res.json("Given Out") : console.error("Error: ", error);
    });
  } else {
    res.json("Not enough items to give out.");
  };
});



app.put('/change-request-stockStatus/:rowID', (req, res) => {

  const rowID = req.params.rowID;
  const stockStatus = "Given Out";

  const sql = "UPDATE hr_admin_request SET stockStatus = ? WHERE id = ?";

  db.query(sql, [stockStatus, rowID], (error, result) => {
    result ? res.json(result[0]) : console.error("Error: ", error);
  });
});

app.get('/get-hr-admin-pending-requests', (req, res) => {

  const pending = "Not Issued";

  const sql = `SELECT
  employees.username AS employee_username, 
 
  supervisor.username AS supervisor_username,
  hr_admin_request.amount, 
  hr_admin_request.description, 
  hr_admin_request.id, 
  hr_admin_request.itemID, 
  hr_admin_request.employeeID, 
  hr_admin_request.supervisorID,
  hr_admin_request.email,
  category.category_name,
  item.name
FROM 
  hr_admin_request
JOIN 
  employees ON hr_admin_request.employeeID = employees.id
JOIN 
  employees AS supervisor ON hr_admin_request.supervisorID = supervisor.id
JOIN 
  category ON hr_admin_request.categoryID = category.id
JOIN 
  item ON hr_admin_request.itemID = item.id
  WHERE hr_admin_request.stockStatus = ? OR hr_admin_request.stockStatus = ''
ORDER BY 
  hr_admin_request.id DESC`;

  db.query(sql, [pending], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-number-of-requests', (req, res) => {

  const sql = "SELECT COUNT(*) AS request_count FROM hr_admin_request WHERE stockStatus = '';";

  db.query(sql, (error, result) => {
    result ? res.json({ requestCount: result[0].request_count }) : console.error("Error: ", error);
  })

})

app.get('/get-hr-admin-given-requests', (req, res) => {

  const sql = `SELECT 
  employees.username AS employee_username, 
  supervisor.username AS supervisor_username,
  hr_admin_request.amount, 
  hr_admin_request.description, 
  hr_admin_request.id, 
  hr_admin_request.supervisorID,
  hr_admin_request.email,
  category.category_name,
  item.name
FROM 
  hr_admin_request
JOIN 
  employees ON hr_admin_request.employeeID = employees.id
JOIN 
  employees AS supervisor ON hr_admin_request.supervisorID = supervisor.id
JOIN 
  category ON hr_admin_request.categoryID = category.id
JOIN 
  item ON hr_admin_request.itemID = item.id
  WHERE hr_admin_request.stockStatus = 'Given Out'
ORDER BY 
  hr_admin_request.id DESC`;

  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-employees-4-items', (req, res) => {

  const sql = `SELECT employees.*, role.role_name, department.department_name
  FROM employees
  JOIN role ON employees.roleID = role.id
  JOIN department ON employees.departmentID = department.id;  
  ;`;

  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-all-items', (req, res) => {
  const sql = `SELECT id, name FROM item;`;
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-count-for-all-serial-numbers', (req, res) => {
  const sql = `SELECT COUNT(*) AS item_count FROM item;
`;
  db.query(sql, (error, result) => {
    if (result && result.length) {
      res.json(result[0].item_count);
    } else {
      console.error("Error: ", error);
    };
  });
});

app.get('/get-serial-numbers-for-item/:ID', (req, res) => {
  const id = req.params.ID;
  const sql = `SELECT serial_number.*, employees.username, company.CompanyName
   FROM 
  serial_number
   LEFT JOIN employees ON serial_number.taker = employees.id 
   LEFT JOIN company ON serial_number.companyID = company.id 
  WHERE itemID = ?;`;
  db.query(sql, [id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-Total-Number-Of-Serials-For-single/:ID', (req, res) => {
  const ID = req.params.ID;
  const sql = `SELECT COUNT(*) AS total_serial_count FROM serial_number WHERE itemID = ?`;
  db.query(sql, ID, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json([total_serial_count = result[0].total_serial_count]);
    };
  });
});

app.get('/get-Total-Number-Of-Serials-For-single-in/:ID', (req, res) => {
  const ID = parseInt(req.params.ID);
  const sql = `SELECT COUNT(*) AS total_serial_count FROM serial_number WHERE status = 'In' AND itemID = ? `;
  db.query(sql, ID, (error, result) => {
    if (error) {
      console.error("Error: ", error);
    } else {
      res.json([total_serial_count = result[0].total_serial_count]);
    };
  });
});

app.get('/get-serial-In/:ID', (req, res) => {
  const ID = req.params.ID;
  const sql = `SELECT COUNT(*) AS total_serial_in FROM serial_number WHERE status = 'In' AND itemID = ?`;
  db.query(sql, ID, (error, result) => {
    if (error) {
      console.error('Error: ', error);
    } else {
      res.json([total_serial_in = result[0].total_serial_in]);
    };
  });
});

app.get('/get-serial-Out/:ID', (req, res) => {
  const ID = req.params.ID;
  const sql = `SELECT COUNT(*) AS total_serial_out FROM serial_number WHERE status = 'Out' AND itemID = ?`;
  db.query(sql, ID, (error, result) => {
    if (error) {
      console.error('Error: ', error);
    } else {
      res.json([total_serial_out = result[0].total_serial_out]);
    };
  });
});

app.get('/get-serial-number-in-different-time/:start/:end/:ID', (req, res) => {
  const start = req.params.start;
  const end = req.params.end;
  const ID = req.params.ID;

  // console.log("End: ", end);
  // console.log("Start: ", start);
  // console.log("ID: ", ID);


  const sql = "SELECT * FROM serial_number WHERE date BETWEEN ? AND ? AND itemID = ?";

  db.query(sql, [start, end, ID], (error, result) => {
    if (result) {
      res.json(result);
    } else {
      console.error("Error: ", error);
    };
  });
});

app.get('/get-serial-number-in-different-time-company/:start/:end/:oneCompanyID', (req, res) => {
  const start = req.params.start;
  const end = req.params.end;
  const ID = req.params.oneCompanyID;

  // console.log("End: ", end);
  // console.log("Start: ", start);
  // console.log("ID: ", ID);

  const sql = `
  SELECT serial_number.*, employees.username
  
  FROM serial_number

  JOIN employees ON serial_number.taker = employees.id
  
  WHERE date BETWEEN ? AND ? AND companyID = ?`;

  db.query(sql, [start, end, ID], (error, result) => {
    if (result) {
      res.json(result);
    } else {
      console.error("Error: ", error);
    };
  });
});

app.get('/pending-numbers', (req, res) => {
  const sql = `SELECT COUNT(*) AS pending_count FROM hr_admin_request WHERE stockStatus = '' OR stockStatus = 'Not Issued'`;
  db.query(sql, (error, result) => {
    result ? res.json({ pending_count: result[0].pending_count }) : console.error("Error: ", error);
  });
});

app.post('/add-company', (req, res) => {
  const name = req.body.name;
  const number = req.body.number;
  const email = req.body.email;

  // console.log("name: ", name);
  // console.log("number: ", number);
  // console.log("email: ", email);

  const sql = 'INSERT INTO company (CompanyName, number, email ) VALUES ( ?, ?, ? )';

  db.query(sql, [name, number, email], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    }
  });
});

app.get('/get-company', (req, res) => {
  const sql = 'SELECT * FROM company';
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-one-company/:id', (req, res) => {
  const ID = req.params.id;
  const sql = `SELECT * FROM company WHERE id = ?`;
  db.query(sql, [ID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});


app.get('/get-total-in/:itemID', (req, res) => {
  const get = `SELECT COUNT(*) AS count FROM serial_number WHERE status = 'In' AND itemID = ?`;
  const itemID = req.params.itemID;
  db.query(get, [itemID], (error, result) => {
    result ? res.json({ totalIn: result[0].count }) : console.error("Error: ", error);
  });
});

app.get('/gets-one/:oneCompanyID', (req, res) => {
  const companyID = req.params.oneCompanyID;

  const sql = `
    SELECT company_records.*, company.CompanyName, item.name AS itemName, employees.username AS employeeName
    FROM company_records
    JOIN company ON company_records.companyID = company.id
    JOIN item ON company_records.itemID = item.id
    JOIN employees ON company_records.employeeID = employees.id
    WHERE company_records.companyID = ?
    ORDER BY company_records.id DESC
  `;

  db.query(sql, [companyID], (error, recordsResult) => {
    if (error) {
      console.error("Error fetching company records:", error);
      res.status(500).json({ error: "Error fetching company records" });
      return;
    }

    const sqli = `SELECT SUM(amount) AS totalAmount FROM company_records WHERE companyID = ?`;

    db.query(sqli, [companyID], (error, amountResult) => {
      if (error) {
        console.error("Error calculating total amount:", error);
        res.status(500).json({ error: "Error calculating total amount" });
        return;
      }

      // Combine the two results into one response
      res.json({
        records: recordsResult,
        totalAmount: amountResult[0]?.totalAmount || 0, // Safely handle empty results
      });
    });
  });
});

app.get('/get-all-company-records', (req, res) => {

  const sql = `
   SELECT company_records.*, company.CompanyName, item.name, employees.username
   FROM company_records
   JOIN company ON company_records.companyID = company.id
   JOIN item ON company_records.itemID = item.id
   JOIN employees ON company_records.employeeID = employees.id
   ORDER BY company_records.id DESC
  `;

  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})

app.get('/get-one-company-for-delivery/:oneCompanyID/:ID', (req, res) => {
  const companyID = req.params.oneCompanyID;
  const ID = req.params.ID
  const sql = `
   SELECT company_records.*, company.CompanyName, item.name, employees.username
   FROM company_records
   JOIN company ON company_records.companyID = company.id
   JOIN item ON company_records.itemID = item.id
   JOIN employees ON company_records.employeeID = employees.id
   WHERE companyID = ? AND company_records.id = ?
     `;
  db.query(sql, [companyID, ID], (error, result) => {
    if (result) {
      // console.log("Result: ", result);
      res.json(result);
    } else {
      console.error("Error: ", error);
    }
  });
});

app.post('/take-needed-days', (req, res) => {
  const empID = req.body.empID;
  const workingDays = req.body.workingDays;
  const applyingYear = req.body.applyingYear;
  const leave_BF = 0;
  const from = req.body.from;
  const to = req.body.to
  //  const remain = Number(18) - workingDays;

  const sql = `INSERT INTO leave_tracker (empID, leave_BF, days_needed, dateStamp, leave_taken, fromx, tox) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [empID, leave_BF, workingDays, applyingYear, workingDays, from, to], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    }
  })
});

app.get('/get-all-days-taken/:ID/:currentYear', (req, res) => {
  const id = req.params.ID;
  const currentYear = req.params.currentYear;

  const sql = `SELECT empID, SUM(CAST(days_needed AS INT)) AS days_needed
FROM leave_tracker
WHERE empID = ? AND dateStamp = ?
GROUP BY empID;`;
  db.query(sql, [id, currentYear], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
});

app.get('/get-leave-taken/:ID/:Year', (req, res) => {
  const id = req.params.ID;
  const year = req.params.Year;

  const sql = `SELECT SUM(days_needed) AS total_leave_taken_in_current_year FROM leave_tracker WHERE empID = ? AND dateStamp = ?`;
  db.query(sql, [id, year], (error, result) => {
    result ? res.json({ total_leave_taken_in_current_year: result[0].total_leave_taken_in_current_year }) : console.error("Error: ", error);
  })
})

app.get('/get-leaveBF/:empID/:currentYear', (req, res) => {
  const empID = req.params.empID;
  const currentYear = req.params.currentYear;

  const sql = `SELECT empID, SUM(CAST(days_needed AS INT)) AS days_needed
FROM leave_tracker
WHERE empID = ? AND dateStamp <> ?
GROUP BY empID;`;

  db.query(sql, [empID, currentYear], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-leave-bf/:ID/:DOEYear/:currentYear', (req, res) => {
  const id = req.params.ID;
  const DOEYear = req.params.DOEYear;
  const currentYear = req.params.currentYear - Number(1);

  const sql = `SELECT SUM(days_needed) AS total_leave_taken_past_years FROM leave_tracker WHERE empID = ? AND dateStamp BETWEEN ? AND ?`;

  db.query(sql, [id, DOEYear, currentYear], (error, result) => {
    result ? res.json(result[0]) : console.error("Error: ", error);
  });
});

app.get('/get-all-leaves', (req, res) => {
  const sql = `SELECT * FROM leaves`;
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-one-leave-type/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM leaves WHERE id = ?`;
  db.query(sql, [id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.post('/post-other-leave', (req, res) => {
  const empID = req.body.empID;
  const name = req.body.name;
  const description = req.body.description;
  const days_needed = req.body.days_needed;
  const leaveStartDate = req.body.leaveStartDate;
  const leaveEndDate = req.body.leaveEndDate;
  const currentYear = req.body.currentYear;

  const sql = `INSERT INTO otherleaves (empID, name,	description, days_needed, startDate, endDate, year) VALUES ( ?, ?, ?, ?, ?, ?, ? )`;
  db.query(sql, [empID, name, description, days_needed, leaveStartDate, leaveEndDate, currentYear], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    }
  });
});

app.get('/get-leave-history/:id', (req, res) => {

  const sql = `
  
  SELECT leave_tracker.*,
  FROM leave_tracker
  JOIN
  employees ON leave_tracker.empID = employees.id
  WHERE 
  leave_tracker.empID = ?

  `;
  db.query(sql, [req.params.id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})

app.get('/get-other-leaves/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT
   otherleaves.*,
   employees.username
   FROM 
   otherleaves
   JOIN 
   employees ON otherleaves.empID = employees.id
   WHERE 
otherleaves.empID = ? 
   `;

  db.query(sql, [id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.post('/send-attendant', (req, res) => {
  // console.log("Got It from Params:", req.body);
  const [
    attendantFirstName,
    attendantSecondName,
    attendantThirdName,
    attendantNationality,
    attendantEmail,
    attendantAddress,
    attendantPhoneNumber,
    attendantBirthDate,
    attendantHeight,
    attendantPassportNumber,
    attendantDrivingLicense,
    attendantTaxIdentificationID,
    attendantEmploymentStatus,
    selectedDepartment,
    selectedRole,
    attendantDisability,
    attendantMaritalStatus,
    attendantPlaceOfWork,
    attendantDOE
  ] = req.body;

  const sql = `INSERT INTO attendant (
  first_name, second_name, third_name, nationality, email, address, phone_number, birth_date,
  height, passport_number, driving_license, tax_identificationID, employment_status, departmenID,
  roleID, disability, marital_status, place_of_work, date_of_employment
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

  db.query(sql, [
    attendantFirstName,
    attendantSecondName,
    attendantThirdName,
    attendantNationality,
    attendantEmail,
    attendantAddress,
    attendantPhoneNumber,
    attendantBirthDate,
    attendantHeight,
    attendantPassportNumber,
    attendantDrivingLicense,
    attendantTaxIdentificationID,
    attendantEmploymentStatus,
    selectedDepartment,
    selectedRole,
    attendantDisability,
    attendantMaritalStatus,
    attendantPlaceOfWork,
    attendantDOE
  ], (error, result) => {
    if (!result) {
      console.error("Error", error);
    }
  });
});

app.post('/send-spouse', (req, res) => {

  const [
    nextAttendantID,
    spouseFirstName,
    spouseSecondName,
    spouseThirdName,
    spousePhoneNumber,
    spouseDateOfBirth,
    spouseEmail,
    spouseOccupation,
    spouseAddress,
    spouseNumberOfChildren
  ] = req.body;

  const sql = `INSERT INTO spouse(attendantID,	first_name,	second_name,	third_name,	phone_number,	date_of_birth,	email,	occupation,	address,	number_of_children	)
   VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
  db.query(sql, [
    nextAttendantID,
    spouseFirstName,
    spouseSecondName,
    spouseThirdName,
    spousePhoneNumber,
    spouseDateOfBirth,
    spouseEmail,
    spouseOccupation,
    spouseAddress,
    spouseNumberOfChildren
  ], (error, result) => {
    if (!result) {
      console.error("Error", error);
    }
  });
});

app.post('/send-family-information', (req, res) => {
  const [
    nextAttendantID,
    fatherFirstName,
    fatherSecondName,
    fatherThirdName,
    fatherPhoneNumber,
    fatherDateOfBirth,
    motherFirstName,
    motherSecondName,
    motherThirdName,
    motherPhoneNumber,
    motherDateOfBirth] = req.body;

  const sql = `INSERT INTO family_info (attendantID,	father_first_name,	father_second_name,	father_third_name,	father_phone_number,	father_DOB,	mother_first_name,	mother_second_name,	mother_third_name,	mother_phone_number,	mother_DOB) 
  VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?)`;
  db.query(sql, [nextAttendantID,
    fatherFirstName,
    fatherSecondName,
    fatherThirdName,
    fatherPhoneNumber,
    fatherDateOfBirth,
    motherFirstName,
    motherSecondName,
    motherThirdName,
    motherPhoneNumber,
    motherDateOfBirth], (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });
});

app.post('/send-emergency-contact/:emergencyContact', (req, res) => {
  const [
    nextAttendantID,
    emergencyFirstName,
    emergencySecondName,
    emergencyThirdName,
    emergencyPhoneNumber,
    emergencyEmail,
  ] = req.params.emergencyContact;

  console.log("Received: ", req.body);

  const sql = `INSERT INTO emergency_contact (attendantID,	first_name,	second_name,	third_name,	phone_number,	email	) 
  VALUES (?, ?, ?, ?, ?, ?)
  `

  db.query(sql, [
    nextAttendantID,
    emergencyFirstName,
    emergencySecondName,
    emergencyThirdName,
    emergencyPhoneNumber,
    emergencyEmail,], (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });
});

app.post('/send-academic', (req, res) => {
  const [
    nextAttendantID,
    institution1,
    institution2,
    institution3,
    institution4,
    institution5,
    dateObtained1,
    dateObtained2,
    dateObtained3,
    dateObtained4,
    dateObtained5,
    academicQualification1,
    academicQualification2,
    academicQualification3,
    academicQualification4,
    academicQualification5,
  ] = req.body;
  const sql = `INSERT INTO academicprofessionq (attendantID,	institution1,	institution2,	institution3,	institution4,	institution5,	date_obtained1,	date_obtained2,	date_obtained3,	date_obtained4,	date_obtained5,	academic_qualification1,	academic_qualification2,	academic_qualification3,	academic_qualification4, academic_qualification5	)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;

  db.query(sql, [
    nextAttendantID,
    institution1,
    institution2,
    institution3,
    institution4,
    institution5,
    dateObtained1,
    dateObtained2,
    dateObtained3,
    dateObtained4,
    dateObtained5,
    academicQualification1,
    academicQualification2,
    academicQualification3,
    academicQualification4,
    academicQualification5,], (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });
});

app.post('/send-relative', (req, res) => {
  const [
    nextAttendantID,
    relativeName,
    relativeRelationship,
    relativeDepartment,
    relativeBranch,
    relativeLatestOrganization,
    relativeJobTitle,
    relativeFromDate,
    relativeCompanyName,
    relativePhoneNumber,
  ] = req.body;

  const sql = `INSERT INTO relativeattenadant(attendantID,	relativeName,	ralativeRelationship,	relativeDepartment,	relativeBranch,	relativeLatestOrganization,	relativeJobTitle,	relativeFromDate,	relativeCompanyName,	relativePhoneNumber	)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    nextAttendantID,
    relativeName,
    relativeRelationship,
    relativeDepartment,
    relativeBranch,
    relativeLatestOrganization,
    relativeJobTitle,
    relativeFromDate,
    relativeCompanyName,
    relativePhoneNumber,], (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });
});

app.post('/send-employment-history', (req, res) => {
  const [
    nextAttendantID,
    whyarrestdetaineddeportedanyauthorityabroad,
    anyreasonfordischargefrompreviousposition,
    addressAnyReasonForLeave
  ] = req.body;
  const sql = `INSERT INTO employmenthistory (attendantID	,why_arrest_detained_deported_anyauthorityabroad	,anyreasonfordischargefrompreviousposition	,addressanyreasonforleaving)
  VALUES(?, ?, ?, ?)
  `;
  db.query(sql, [nextAttendantID,
    whyarrestdetaineddeportedanyauthorityabroad,
    anyreasonfordischargefrompreviousposition,
    addressAnyReasonForLeave], (error, result) => {
      if (!result) {
        console.error("Error", error);
      }
    });
});

app.get('/get-next-attendant-id', (req, res) => {
  const sql = `SELECT MAX(id) AS latest_id FROM attendant`;
  db.query(sql, (error, result) => {
    result ? res.json(result[0]) : console.error("Error:", error);
  });
});

app.get('/get-attendants', (req, res) => {
  const sql = `SELECT attendant.*,
       role.role_name,
       department.department_name
FROM attendant
JOIN role ON attendant.roleID = role.id
JOIN department ON attendant.departmenID = department.id;
`;
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error In fetching all attendants");
  })
});

app.get('/attendee-once/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT 
    -- Fields from the attendant table
    a.id,
    a.first_name,
    a.second_name,
    a.third_name,
    a.nationality,
    a.email,
    a.address,
    a.phone_number,
    a.birth_date,
    a.height,
    a.passport_number,
    a.driving_license,
    a.tax_identificationID,
    a.employment_status,
    d.department_name,  -- Department name from the department table (via departmentID)
    r.role_name,        -- Role name from the role table (via roleID)
    a.disability,
    a.marital_status,

    -- Fields from the spouse table
    s.first_name AS spouse_first_name,
    s.second_name AS spouse_second_name,
    s.third_name AS spouse_third_name,
    s.phone_number AS spouse_phone_number,
    s.date_of_birth AS spouse_dob,
    s.email AS spouse_email,
    s.occupation AS spouse_occupation,
    s.address AS spouse_address,
    s.number_of_children AS spouse_number_of_children,

    -- Fields from the family_info table
    f.father_first_name,
    f.father_second_name,
    f.father_third_name,
    f.father_phone_number,
    f.father_DOB,
    f.mother_first_name,
    f.mother_second_name,
    f.mother_third_name,
    f.mother_phone_number,
    f.mother_DOB,

    -- Fields from the emergency_contact table
    e.first_name AS emergency_contact_first_name,
    e.second_name AS emergency_contact_second_name,
    e.third_name AS emergency_contact_third_name,
    e.phone_number AS emergency_contact_phone_number,
    e.email AS emergency_contact_email,

    -- Fields from the academicprofessionq table
    ac.institution1,
    ac.institution2,
    ac.institution3,
    ac.institution4,
    ac.institution5,
    ac.date_obtained1,
    ac.date_obtained2,
    ac.date_obtained3,
    ac.date_obtained4,
    ac.date_obtained5,
    ac.academic_qualification1,
    ac.academic_qualification2,
    ac.academic_qualification3,
    ac.academic_qualification4,
    ac.academic_qualification5,

    -- Fields from the relativeattendant table
    rel.relativeName,	
    rel.ralativeRelationship,	
    rel.relativeDepartment,	
    rel.relativeBranch,	
    rel.relativeLatestOrganization,	
    rel.relativeJobTitle,	
    rel.relativeFromDate,	
    rel.relativeCompanyName,	
    rel.relativePhoneNumber,

    -- Fields from the employmenthistory table
    eh.why_arrest_detained_deported_anyauthorityabroad,
    eh.anyreasonfordischargefrompreviousposition,	
    eh.addressanyreasonforleaving

-- Primary table: attendant
FROM attendant a

-- LEFT JOIN with spouse table using attendantID
LEFT JOIN spouse s ON a.id = s.attendantID

-- LEFT JOIN with family_info table using attendantID
LEFT JOIN family_info f ON a.id = f.attendantID

-- LEFT JOIN with emergency_contact table using attendantID
LEFT JOIN emergency_contact e ON a.id = e.attendantID

-- LEFT JOIN with academicprofessionq table using attendantID
LEFT JOIN academicprofessionq ac ON a.id = ac.attendantID

-- LEFT JOIN with relativeattendant table using attendantID
LEFT JOIN relativeattenadant rel ON a.id = rel.attendantID

-- LEFT JOIN with employmenthistory table using attendantID
LEFT JOIN employmenthistory eh ON a.id = eh.attendantID

-- LEFT JOIN with department table to fetch department_name based on departmentID
LEFT JOIN department d ON a.departmenID = d.id

-- LEFT JOIN with role table to fetch role_name based on roleID
LEFT JOIN role r ON a.roleID = r.id

-- Filter to fetch data for a specific attendant (with ID = 2)
WHERE a.id = ?;
  `;
  db.query(sql, [id], (error, result) => {
    result ? res.json(result) : console.error("Error In fetching one attendant");
  });
});

app.delete('/delete-entire-attendant/:currentAttendantID', async (req, res) => {
  const id = req.params.currentAttendantID;

  try {
    // Start transaction
    await query('START TRANSACTION');

    await query('DELETE FROM spouse WHERE attendantID = ?', [id]);
    await query('DELETE FROM family_info WHERE attendantID = ?', [id]);
    await query('DELETE FROM emergency_contact WHERE attendantID = ?', [id]);
    await query('DELETE FROM academicprofessionq WHERE attendantID = ?', [id]);
    await query('DELETE FROM relativeattenadant WHERE attendantID = ?', [id]);
    await query('DELETE FROM employmenthistory WHERE attendantID = ?', [id]);

    // Finally, delete from the attendant table
    await query('DELETE FROM attendant WHERE id = ?', [id]);

    // Commit the transaction
    await query('COMMIT');

    res.status(200).send({ message: 'Attendant and related data deleted successfully.' });
  } catch (error) {
    console.error("Error: ", error);
    await query('ROLLBACK');
    res.status(500).send({ error: 'Error deleting attendant data', details: error });
  }
});

app.get('/get-unlocated', (req, res) => {
  const sql = `SELECT serial_number.* FROM serial_number LEFT JOIN item ON serial_number.itemID = item.id WHERE item.id IS NULL;`;
  db.query(sql, (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-serial-id/:serialID/:id', (req, res) => {
  const serialID = req.params.serialID;
  const id = req.params.id;

  const sql = `
  
  SELECT company_records.*, serial_number.serial_number
  FROM
  company_records
  JOIN serial_number ON company_records.serialID = serial_number.id
  WHERE company_records.id = ? AND company_records.serialID = ? 

  `;
  db.query(sql, [id, serialID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-multiple-taken/:startFrom/:endTo/:itemID/:oneCompanyID', (req, res) => {

  const start = parseInt(req.params.startFrom, 10); // Bigger number
  const end = parseInt(req.params.endTo, 10); // Smaller number
  const itemID = req.params.itemID;
  const oneCompanyID = req.params.oneCompanyID;

  // Validate input
  if (isNaN(start) || isNaN(end) || start < end) {
    return res.status(400).json({ error: 'Invalid startFrom or endTo values. Ensure startFrom > endTo.' });
  }

  const sql = `
    SELECT 
        serial_number
    FROM 
        serial_number
    WHERE 
        itemID = ?
        AND companyID = ?
        AND CAST(SUBSTRING_INDEX(serial_number, ' ', -1) AS UNSIGNED) BETWEEN ? AND ?
        AND SUBSTRING_INDEX(serial_number, ' ', 1) IN (
            SELECT 
                SUBSTRING_INDEX(serial_number, ' ', 1)
            FROM 
                serial_number
            WHERE 
                itemID = ?
                AND companyID = ?
                AND CAST(SUBSTRING_INDEX(serial_number, ' ', -1) AS UNSIGNED) = ?
        )
        AND SUBSTRING_INDEX(serial_number, ' ', 1) IN (
            SELECT 
                SUBSTRING_INDEX(serial_number, ' ', 1)
            FROM 
                serial_number
            WHERE 
                itemID = ?
                AND companyID = ?
                AND CAST(SUBSTRING_INDEX(serial_number, ' ', -1) AS UNSIGNED) = ?
        )
    ORDER BY 
        CAST(SUBSTRING_INDEX(serial_number, ' ', -1) AS UNSIGNED);
  `;

  const params = [
    itemID,
    oneCompanyID,
    end, // Smaller number
    start, // Bigger number
    itemID,
    oneCompanyID,
    end, // Ensure first part exists for this number
    itemID,
    oneCompanyID,
    start // Ensure first part exists for this number
  ];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed.' });
    }
    res.json(results);
  });
});


app.delete('/delete-unlocated-serials', (req, res) => {
  const sql = `DELETE serial_number.*
    FROM serial_number
    LEFT JOIN item ON serial_number.itemID = item.id
    WHERE item.id IS NULL;`;

  db.query(sql, (error, result) => {
    // result ? console.log("DELETE WELL!!") : console.error("Error: ", error);
  });
});

app.post('/out-history/:selectedItemID/:status/:id', (req, res) => {
  const itemID = req.params.selectedItemID
  const status = 'Taken';
  const id = req.params.id;
  const amount = 1;


  const Dday = new Date().getDate()
  const Mmonth = new Date().getMonth() + 1;
  const Yyear = new Date().getFullYear();

  const today = `${Dday}/${Mmonth}/${Yyear}`;


  const sql = `INSERT INTO daily_item_transaction (itemID,	employeeID,	date,	status,	amount) VALUES (?, ?, ?, ? ,?)`;
  db.query(sql, [itemID, id, today, status, amount], (error, result) => {
    result ? res.status(200) : console.error("Error", error);
  });
});


app.get('/get-all-leave-request/:id', (req, res) => {

  const id = req.params.id

  const sql = `
  SELECT
   employee_leave_request.id,
   employee_leave_request.leave,
   employee_leave_request.description,
   employee_leave_request.date_of_request,
   employee_leave_request.email,
   employee_leave_request.startDate,
   employee_leave_request.endDate,
   employee_leave_request.daysRequired,
   employee_leave_request.empID,
   employee_leave_request.status,
   employee_leave_request.roleID,
   employee_leave_request.supervisor_concerned AS supervisor_concerned_id,
   role.role_name,
   employees.username AS employeeName,
   supervisorConcerned.username AS supervisorConcerned

FROM employee_leave_request 

JOIN role ON employee_leave_request.roleID = role.id
JOIN employees ON employee_leave_request.empID = employees.id
JOIN employees AS supervisorConcerned ON employee_leave_request.supervisor_concerned = supervisorConcerned.id

   
WHERE supervisor_concerned = ? AND employee_leave_request.status = 'Pending';

  `;

  db.query(sql, [id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.put('/change-employee-leave-status/:id', (req, res) => {

  const status = 'Approved By Supervisor';

  const sql = `UPDATE employee_leave_request SET status = ? WHERE id = ?  `;

  db.query(sql, [status, req.params.id], (error, result) => {
    // result ? console.log("Employee Notified") : console.error("Error: ", error);
  });
});

app.put('/change-employee-leave-status-hr/:id', (req, res) => {

  const status = 'Approved By HR';

  const sql = `UPDATE employee_leave_request SET status = ? WHERE id = ?  `;

  db.query(sql, [status, req.params.id], (error, result) => {
    // result ? console.log("Employee Notified") : console.error("Error: ", error);
  });
});

app.put('/deny-employee-leave-supervisor/:rowID', (req, res) => {

  const status = 'Denied By Supervisor';

  const sql = `UPDATE employee_leave_request SET status = ? WHERE id = ?`;
  db.query(sql, [status, req.params.rowID], (error, result) => {
    // result ? console.log("Done!") : console.error("Error: ", error);
  });
});

app.put('/deny-employee-leave-hr/:rowID', (req, res) => {

  const status = 'Denied By Hr';

  const sql = `UPDATE employee_leave_request SET status = ? WHERE id = ?`;
  db.query(sql, [status, req.params.rowID], (error, result) => {
    // result ? console.log("Done!") : console.error("Error: ", error);
  });
});


app.post('/insert-employee-leave-into-hr', (req, res) => {

  const status = 'Pending';

  const sql = 'INSERT INTO supervisor_hr_leave_request (empID,	supervisorID,	date_of_request,	email,	startDate,	endDate,	days_required,	roleID, description, `leave`, status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [req.body.empID, req.body.supervisor_concerned_id, req.body.date_of_request, req.body.email, req.body.startDate, req.body.endDate, req.body.daysRequired, req.body.roleID, req.body.description, req.body.leave, status],
    (error, result) => {
      if (!result) {
        console.error('Error: ', error);
      }
    });
});

app.get('/get-leave-notifications-employee/:id', (req, res) => {

  // console.log("Hit~~~~~");

  const sql = `
  SELECT employee_leave_request.*,
employees.username
   FROM employee_leave_request
   JOIN employees ON employee_leave_request.empID = employees.id
   WHERE empID = ?`;
  db.query(sql, [req.params.id], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.put('/approve-employee-leave-hr-table/:id', (req, res) => {

  const sql = `UPDATE supervisor_hr_leave_request SET status = 'Approved' WHERE id = ? `;
  db.query(sql, [req.params.id], (error, result) => {
    // result ? console.log("Done") : console.error("Error: ", error);
  })
})

app.put('/deny-employee-leave-hr-table/:id', (req, res) => {

  const sql = `UPDATE supervisor_hr_leave_request SET status = 'Denied' WHERE id = ? `;
  db.query(sql, [req.params.id], (error, result) => {
    // result ? console.log("Done") : console.error("Error: ", error);
  })
})

app.get('/check-serial-number-names/:itemID', (req, res) => {

  const sql = `SELECT serial_number FROM serial_number WHERE itemID = ?`;

  db.query(sql, [req.params.itemID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.get('/get-all-first-parts/:itemID', (req, res) => {
  const itemID = req.params.itemID;


  const sql = `SELECT DISTINCT
    SUBSTRING_INDEX(serial_number, ' ', 1) AS first_part
FROM 
    serial_number WHERE itemID = ?`;

  db.query(sql, [itemID], (error, result) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Database query error" });
    } else {
      // Map over result to create an array of first_part values
      const firstParts = result.map(row => row.first_part);
      // console.log("First Parts:", firstParts);
      res.json(firstParts); // Send the array of first parts only
    }
  });
})

app.get('/check/:wholeWordArray', (req, res) => {
  const wholeWordArrayString = req.params.wholeWordArray;

  // Split the string into an actual array of serial numbers
  const wholeWordArray = wholeWordArrayString.split(',');

  if (!Array.isArray(wholeWordArray) || wholeWordArray.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty serial numbers array' });
  }

  // Construct placeholders for the query based on the number of serial numbers
  const placeholders = wholeWordArray.map(() => '?').join(',');

  const sql = `
    SELECT serial_number
    FROM serial_number 
    WHERE serial_number IN (${placeholders})
  `;

  db.query(sql, wholeWordArray, (error, result) => {
    if (error) {
      console.error("Error checking serial numbers:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    const existingSerials = result.map(row => row.serial_number);

    // Check if every serial in wholeWordArray is present in the database result
    const allExist = wholeWordArray.every(serial => existingSerials.includes(serial));

    if (allExist) {
      res.json("All serial_numbers exist");
    } else {
      res.json("Serials don't exist");
    }
  });
});




app.put('/take-give-out-bulk/:itemID/:wholeWordArray/:companyID', (req, res) => {

  // console.log("Hittttttttttttt");

  const serials = req.params.wholeWordArray.split(',');
  const itemID = req.params.itemID;
  const companyID = req.params.companyID

  const sql = `UPDATE serial_number SET status = 'Out', companyID = ? WHERE itemID = ? AND serial_number = ? AND status = 'In'`;

  serials.forEach((serial) => {
    db.query(sql, [companyID, itemID, serial.trim()], (error, result) => {
      if (!result) {
        console.error("Error: ", error);
      }
    });
  });
});

app.post('/post-company-records/:selectedItem/:oneCompanyID/:selectedSupervisor/:realQuantity/:dateOfRequisition/:serialID/:startFrom/:endTo/:selectedFirstPart', (req, res) => {

  const status = "Issued";

  const companyID = req.params.oneCompanyID;
  const itemID = parseInt(req.params.selectedItem);
  const amount = req.params.realQuantity;
  const requestor = req.params.selectedSupervisor;
  const date = req.params.dateOfRequisition;
  const serialID = req.params.serialID;
  const startFrom = req.params.startFrom;
  const endTo = req.params.endTo
  const selectedFirstPart = req.params.selectedFirstPart

  const sql = `INSERT INTO company_records (companyID,	itemID, date,	amount, employeeID,	status, serialID, startFrom, endTo, first_part) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [companyID, itemID, date, amount, requestor, status, serialID, startFrom, endTo, selectedFirstPart], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    }
  });
});

app.get('/get-serial-match/:serialMatch', (req, res) => {
  const serialMatch = `%${req.params.serialMatch}%`;

  // console.log("Match!!!", serialMatch);

  const sql = `
   SELECT DISTINCT serial_number, id
FROM serial_number
WHERE status = 'In' AND serial_number LIKE ?

    `;

  db.query(sql, [serialMatch], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})

app.put('/give-out-one-serial-by-choice/:serialID/:oneCompanyID/:selectedSupervisor', (req, res) => {

  const sql = `UPDATE serial_number SET companyID = ?, status = 'Out', taker = ? WHERE id = ? `;
  db.query(sql, [req.params.oneCompanyID, req.params.selectedSupervisor, parseInt(req.params.serialID)], (error, result) => {
    if (!result) {
      console.error("Error", error);
    }
  });
});


app.delete('/delete-company-record/:id', (req, res) => {
  const sql = `DELETE FROM company_records WHERE id = ?`;
  db.query(sql, [req.params.id], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    };
  });
});

app.get('/serial-numbers-validation/:wholeWordArray', (req, res) => {
  const wholeWordArray = req.params.wholeWordArray;
  const wordArray = wholeWordArray.split(',');

  // Query to find serial numbers with status "Out"
  const sql = `SELECT serial_number 
               FROM serial_number
               WHERE serial_number IN (?) AND status = 'Out'`;

  db.query(sql, [wordArray], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      // Some serial numbers are "Out"
      return res.json({ message: 'Given Out', serials: results });
    } else {
      // All serial numbers are good
      return res.json({ message: 'All Good!!!' });
    }
  });
});

app.delete('/delete-item-transaction/:id', (req, res) => {
  const sql = `DELETE FROM item_transaction WHERE id = ?`;
  db.query(sql, [req.params.id], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    };
  });
});

app.get('/get-taken-serials/:replace', (req, res) => {
  const word = `%${req.params.replace}%`;

  const sql = `  SELECT DISTINCT serial_number, id
FROM serial_number
WHERE status = 'Out' AND serial_number LIKE ?
`;

  db.query(sql, [word], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  });
});

app.put('/change-delivery-status/:deliveryID/:oneCompanyID', (req, res) => {
  const sql = `UPDATE serial_number SET status = 'Out', taker = 0, companyID = ? WHERE id = ?`;
  db.query(sql, [req.params.deliveryID, req.params.oneCompanyID], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    };
  });
});

app.put('/change-replace-status/:replaceID', (req, res) => {
  const sql = `UPDATE serial_number SET status = 'Replaced', state_of_item = 'Wrapped Up' WHERE id = ?`;
  db.query(sql, [req.params.replaceID], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    };
  });
});

app.post('/post-replacement/:replaceID/:deliveryID/:companyID', (req, res) => {
  const date = new Date();
  const sql = `INSERT INTO replacement_table (deliveryID, replacementID, date, companyID) VALUES (?, ?, ?, ?)`;
  db.query(sql, [req.params.deliveryID, req.params.replaceID, date, req.params.companyID], (error, result) => {
    if (!result) {
      console.error("Error: ", error);
    };
  });
});

app.get('/get-replacement-data/:oneCompanyID', (req, res) => {
  const sql = ` 
  SELECT 
  replacement_table.date,
  delivery.itemID AS deliveryItemID,
    delivery.serial_number AS deliverySerial,
    delivery_item.name AS deliveryItemName,
    replacement.itemID AS replacementItemID,
    replacement_item.name AS replacementItemName,
    replacement.serial_number AS replacementSerial,
    replacement_table.companyID
FROM 
    replacement_table
JOIN 
    serial_number AS delivery 
ON 
    replacement_table.deliveryID = delivery.id
JOIN 
    item AS delivery_item 
ON 
    delivery.itemID = delivery_item.id
JOIN 
    serial_number AS replacement 
ON 
    replacement_table.replacementID = replacement.id
JOIN 
    item AS replacement_item 
ON 
    replacement.itemID = replacement_item.id
WHERE replacement_table.companyID = ?; 
  `;
  db.query(sql, [req.params.oneCompanyID], (error, result) => {
    result ? res.json(result) : console.error("Error: ", error);
  })
})


app.listen(port, () => {
  console.log("Connected to backend");
});
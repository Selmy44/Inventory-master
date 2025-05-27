// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// const { Server } = require("socket.io");
// const http = require("http");
// const fs = require('fs');
// const moment = require('moment');
// const nodemailer = require('nodemailer');
// const { EMAIL, PASSWORD } = require('./env.js');
// const { Blob } = require("buffer");


// const app = express();
// const server = http.createServer(app);

// app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.json());

// app.use(cors({
//   origin: ["http://localhost:3000"],
//   methods: ["POST", "GET", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     maxAge: 1000 * 60 * 60 * 24
//   }
// }));

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "inventory",
// });

// //-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["POST", "GET"]
//   },
//   debug: true
// });

// io.on("connection", (socket) => {
//   socket.on("Employee_Message_Supervisor(1)", async (messageData) => {

//     console.log("From employee: to supervisor", messageData);
//     const getEmployeeID = (employeeName) => {
//       return new Promise((resolve, reject) => {
//         const sql = `SELECT id FROM employees WHERE username = ?`;
//         db.query(sql, [employeeName], (error, result) => {
//           if (error) {
//             console.error(error);
//             reject(error);
//           } else {
//             const employeeID = result.length > 0 ? result[0].id : null;
//             // console.log("Employee ID", employeeID);
//             resolve(employeeID);
//           }
//         });
//       });
//     };

//     const getItemID = (itemName) => {
//       return new Promise((resolve, reject) => {
//         const sql = `SELECT id FROM item WHERE name = ?`;
//         db.query(sql, [itemName], (error, result) => {
//           if (error) {
//             console.error(error);
//             reject(error);
//           } else {
//             const itemID = result.length > 0 ? result[0].id : null;
//             // console.log("Item ID", itemID);
//             resolve(itemID);
//           }
//         });
//       });
//     };

//     const getCategoryID = (categoryName) => {
//       return new Promise((resolve, reject) => {
//         const sql = `SELECT id FROM category WHERE category_name = ?`;
//         db.query(sql, [categoryName], (error, result) => {
//           if (error) {
//             console.error(error);
//             reject(error);
//           } else {
//             const categoryName = result.length > 0 ? result[0].id : null;
//             // console.log("Item ID", categoryName);
//             resolve(categoryName);
//           }
//         });
//       });
//     }

//     try {
//       const gotEmployeeName = messageData.employeeName;
//       const employeeID = await getEmployeeID(gotEmployeeName);

//       const gotItemName = messageData.itemName;
//       const itemID = await getItemID(gotItemName);

//       const gotCategoryName = messageData.categoryName;
//       const categoryID = await getCategoryID(gotCategoryName);

//       const status = 'Pending'

//       const email = messageData.email;

//       const priority = messageData.priority;

//       const supervisorID = messageData.supervisor

//       const q =
//         "INSERT INTO employee_supervisor_request ( categoryID,	itemID,	employeeID,	description,	date_of_request, email,	status,	amount, priority, supervisor_concerned ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
//       const values = [categoryID, itemID, employeeID, messageData.description, messageData.date, email, status, messageData.count, priority, supervisorID];

//       db.query(q, values, (err, data) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send("Internal Server Error");
//         } else {
//           id = data.insertId;
//           // return id;
//         }
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });

//   socket.on("HandleDelete", (object) => {
//     console.log("Object Shown", object);
//   })

//   app.get('/get-notification/:supervisorID', (req, res) => {
//     const sql = `
//     SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount,employee_supervisor_request.priority, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
//     FROM employee_supervisor_request
//     JOIN employees ON employee_supervisor_request.employeeID = employees.id
//     JOIN category ON employee_supervisor_request.categoryID = category.id
//     JOIN item ON employee_supervisor_request.itemID = item.id
//    WHERE employee_supervisor_request.status = 'Pending' AND employee_supervisor_request.supervisor_concerned = ? 	
//     ORDER BY employee_supervisor_request.id DESC;
//     `;
//     const supervisorID = req.params.supervisorID;

//     db.query(sql, [supervisorID], (error, result) => {
//       if (error) {
//         console.error("Error", error);
//       } else {
//         return res.json(result);
//       }
//     })
//   })

//   app.get('/get-notifications', (req, res) => {
//     const sql = `SELECT 
//     employees.username AS employee_username, 
//     supervisor.username AS supervisor_username,
//     supervisor_hr_request.amount, 
//     supervisor_hr_request.description, 
//     supervisor_hr_request.date_approved, 
//     supervisor_hr_request.id, 
//     supervisor_hr_request.supervisorID,
//     supervisor_hr_request.email,
//     supervisor_hr_request.status,
//     supervisor_hr_request.priority,
//     category.category_name,
//     item.name
// FROM 
//     supervisor_hr_request
// JOIN 
//     employees ON supervisor_hr_request.employeeID = employees.id
// JOIN 
//     employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
// JOIN 
//     category ON supervisor_hr_request.categoryID = category.id
// JOIN 
//     item ON supervisor_hr_request.itemID = item.id
//     WHERE supervisor_hr_request.status = 'Pending'
// ORDER BY 
//     supervisor_hr_request.id DESC;
//  `
//     db.query(sql, (error, result) => {
//       if (error) {
//         console.error("Error", error);
//       } else {
//         // console.log("ZATA: ", result);
//         return res.json(result);
//         // return res.json(result);
//       }
//     })
//   })

//   socket.on('get-some', () => {

//     try {
//       const sql = `SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount, employee_supervisor_request.description, employee_supervisor_request.date_of_request, employee_supervisor_request.id, employee_supervisor_request.status 
//       FROM employee_supervisor_request
//       JOIN employees ON employee_supervisor_request.employeeID = employees.id
//       JOIN category ON employee_supervisor_request.categoryID = category.id
//       JOIN item ON employee_supervisor_request.itemID = item.id
//       ORDER BY employee_supervisor_request.id DESC;
//       `;

//       db.query(sql, (error, result) => {
//         if (error) {
//           console.error("Error", error);
//         } else {
//           console.log("Result: ", result);
//           socket.emit("give-some", result);
//         }

//       })
//     } catch (error) {
//       console.error("Error ", error)
//     }
//   })

//   socket.on("Supervisor_Message_HR(1)", (messageData, supervisorName) => {
//     console.log("From supervisor: to HR", messageData, supervisorName);
//     console.log("TYPE OF message", typeof messageData);

//     const follow = "Approved By Supervisor";

//     const id = messageData.id;

//     const sql = `UPDATE employee_supervisor_request SET status = ? WHERE id = ?`;

//     const values = [follow, id];

//     db.query(sql, values, (error, result) => {
//       result ? console.log("Done Well: ", result) : console.error("Error: ", error);
//     })



//     io.emit("Supervisor_Message_HR(2)", messageData, supervisorName)
//   })

//   socket.on("HR_Message_Stock(1)", (messageData, updatedNotification) => {
//     console.log("From HR: to stockManager", messageData, updatedNotification);
//     io.emit("HR_Message_Stock(2)", messageData, updatedNotification)
//   })

//   socket.on("Stock_Message_Employee(1)", (messageData) => {
//     console.log("From HR: to stockManager", messageData);
//     io.emit("Stock_Message_Employee(2)", ([messageData]))
//   })

//   socket.on("Denied_By_Either(1)", (messageData) => {
//     console.log("Denied Request Info", messageData);
//     io.emit("Denied_By_Either(2)", messageData);
//   })


//   socket.on("Approved_By_Either(1)", (MessageData) => {
//     console.log("Data response from the admin: ", MessageData)
//     io.emit("Approved_By_Either(2)", MessageData);
//   });

//   socket.on("Denied", (notifications, newStatus) => {
//     console.log("Data response from Admin: ", notifications, newStatus);
//     io.emit("Denied", notifications, newStatus);
//   });

//   socket.on("Take This", (messageData) => {
//     console.log("Update Approved Is hit ");

//     const id = messageData.id;

//     const status = "Approved";

//     const sql = `UPDATE employee_supervisor_request SET status = ? WHERE id = ?`;

//     db.query(sql, [status, id], (error, result) => {
//       if (error) {
//         console.error("Error: ", error)
//       } else {
//         console.log("Status set Approved");
//       }
//     });
//   });

//   socket.on("Take this purchase", (messageData) => {
//     console.log("Update Approved Is hit ");

//     const id = messageData.id;

//     const status = "Approved";

//     const sql = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

//     db.query(sql, [status, id], (error, result) => {
//       if (error) {
//         console.error("Error: ", error)
//       } else {
//         console.log("Status set Approved");
//       }
//     });

//   })

//   socket.on("change-status-approve", (messageData) => {
//     console.log("Update status Is hit ");
//     const id = messageData.id;

//     const status = "Approved";

//     const sql = `UPDATE supervisor_hr_request SET status = ? WHERE id = ?`;
//     db.query(sql, [status, id], (error, result) => {
//       if (error) {
//         console.error("Error: ", error)
//       } else {
//         console.log("Status set Approved");
//       };
//     });
//   });

//   socket.on("change-status-approve-purchase", (messageData) => {
//     console.log("Update status Is hit ");
//     const id = messageData.id;

//     const sql = `UPDATE supervisor_hr_purchase SET status = 'Approved' WHERE id = ?`;
//     db.query(sql, [ id], (error, result) => {
//       result ? console.log("Done") : console.error("Error: ", error);
//     });
//   })

//   socket.on("change-status-deny", (messageData) => {
//     console.log("Denied status Is hit");
//     const id = messageData.id;

//     const status = "Denied";

//     const sql = `UPDATE supervisor_hr_request SET status = ? WHERE id = ?`;
//     db.query(sql, [status, id], (error, result) => {
//       if (error) {
//         console.error("Error: ", error)
//       } else {
//         console.log("Status set Denied");
//       };
//     });
//   });

//   socket.on("change-status-deny-for-employee", (messageData) => {
//     console.log("~~~~~Change for employee Hit~~~~~");

//     const id = messageData.id;
//     const status = "Denied";

//     const sqli = `UPDATE employee_supervisor_request SET status = ? WHERE id = ?`;

//     db.query(sqli, [status, id], (error, result) => {
//       if (error) {
//         console.error("Error: ", error)
//       } else {
//         console.log("Status set Denied");
//       };
//     });
//   });

//   socket.on("Deny For Employee Purchase", (messageData) => {
//     const id = messageData.id;

//     const status = "Denied";

//     const sqli = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

//     db.query(sqli, [status, id], (error, result) => {
//      result ? console.log("Updated Well") : console.error("Error: ", error);
//     });
//   })

//   socket.on("Send Approved Email", (messageData) => {
//     console.log("Object to be sent", messageData);

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: EMAIL,
//         pass: PASSWORD
//       }
//     });

//     const mailOption = {
//       from: 'Centrika Inventory System',
//       to: messageData.email,
//       subject: 'Item Requested Approved',
//       text: `Item you requested ${messageData.name} was successfully approved on ${messageData.date_approved}`
//     };

//     transporter.sendMail(mailOption, function (error, info) {
//       if (error) {
//         console.error("Error", error)
//       } else {
//         const response = info;
//       }
//     })
//   });

//   socket.on("Send Approved Email Purchase", (messageData) => {
//     console.log("Object to be sent", messageData);

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: EMAIL,
//         pass: PASSWORD
//       }
//     });

//     const mailOption = {
//       from: 'Centrika Inventory System',
//       to: messageData.email,
//       subject: 'Item Requested For Purchase Approved',
//       text: `Item you requested for purchase: ${messageData.expenditure_line} was successful with amount ${messageData.amount}FRW approved on ${messageData.date} notify the administration for further details.`
//     };

//     transporter.sendMail(mailOption, function (error, info) {
//       if (error) {
//         console.error("Error: ", error)
//       } else {
//         const response = info;
//       }
//     })
//   });

//   app.post('/send-through-API', (req, res) => {
//     const email = req.body.email;
//     const name = req.body.name;
//     const date_approved = req.body.date_approved;

//     console.log("Object to be sent", email);

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: EMAIL,
//         pass: PASSWORD
//       }
//     });

//     const mailOption = {
//       from: 'Centrika Inventory System',
//       to: email,
//       subject: 'Item Requested For Purchase Approved',
//       text: `Item you requested for purchase: ${name} was successfully approved on ${date_approved} notify the administration for further details.`
//     };

//     transporter.sendMail(mailOption, function (error, info) {
//       if (error) {
//         console.error("Error: ", error)
//       } else {
//         const response = info;
//       }
//     })
//   })

//   socket.on("disconnect", () => {
//   });
// });

// server.listen(5001, () => {
//   console.log("Socket server is running on http://localhost:5001");
// });

// //-----------------Socket---------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // Add your routes and other configurations below this line

// app.post("/employee", (req, res) => {
//   const department = req.body.departmentName;
//   const role = req.body.roleName;

//   const departmentID = parseInt(department, 10);
//   const roleID = parseInt(role, 10);

//   console.log("Department ID", department);
//   console.log("role ID", role);
//   const status = 'ACTIVE';

//   const query = "INSERT INTO employees (username, password, roleID, departmentID, status, email) VALUES (?, ?, ?, ?, ?, ?)";

//   const values = [
//     req.body.username,
//     req.body.password,
//     roleID,
//     departmentID,
//     status,
//     req.body.email,
//   ];

//   db.query(query, values, (error, result) => {
//     if (error) {
//       console.error("Error: ".error);
//     } else {
//       console.log(result)
//     }

//   })
// })

// app.post("/add-employee", (req, res) => {

// });

// app.post('/add-items', (req, res) => {
//   const categoryId = req.body.category;

//   console.log("Category", categoryId);

//   const supplierId = req.body.supplier;

//   const intValue = parseInt(supplierId, 10);

//   console.log("Supplier", supplierId);

//   const insertQuery = 'INSERT INTO item (name, supplierID, categoryID) VALUES (?, ?, ?)';

//   const insertValues = [
//     req.body.name || null,
//     intValue,
//     categoryId || null,
//   ];

//   console.log("VALUES: ", insertValues)

//   db.query(insertQuery, insertValues, (insertError, result) => {
//     if (insertError) {
//       console.error('Error adding item:', insertError);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.status(201).json({ message: 'Item added successfully' });
//   });
// });


// app.put("/employee/:id", (req, res) => {
//   const empID = req.params.id;
//   const roleName = req.body.roleName;
//   const departmentName = req.body.departmentName;
//   const username = req.body.username;
//   const password = req.body.password;
//   const status = req.body.status;
//   const email = req.body.email;

//   console.log("FROM BODY: ", empID);
//   console.log("FROM BODY: ", roleName);
//   console.log("FROM BODY: ", departmentName);
//   console.log("FROM BODY: ", username);
//   console.log("FROM BODY: ", password);
//   console.log("FROM BODY: ", status);
//   console.log("FROM BODY: ", email);

//   function getRoleId(role) {
//     const q = 'SELECT role_name FROM role WHERE id = ?'
//     const value = [role];
//     db.query(q, value, (error, result) => {
//       if (error) {
//         console.error("Error: ", error);
//       } else {
//         console.log("Done", result);
//         return result;
//       }
//     })
//   }

//   function getDepartmentId(department) {
//     const q = 'SELECT department_name FROM department WHERE id = ?'
//     const value = [department];
//     db.query(q, value, (error, result) => {
//       if (error) {
//         console.error("Error: ", error);
//       } else {
//         console.log("Done", result);
//         return result;
//       }
//     })
//   }



//   const q = "UPDATE employees SET username = ?, password = ?, roleID = ?, departmentID = ?, status = ?, email = ? WHERE id = ?";
//   const values = [
//     username,
//     password,
//     roleName,
//     departmentName,
//     status,
//     email,
//     empID
//   ];
//   db.query(q, values, (err, data) => {
//     if (err) {
//       console.error("Error updating: ", err);
//       return res.status(500).json({ error: "Internal Server Error" })
//     }
//     console.log("Employee Update Successfully", data);
//     return res.json(data)
//   });
// })

// app.get("/employee/:id", (req, res) => {
//   const empID = req.params.id;
//   const q = ` SELECT
//     employees.id,
//     employees.username,
//     employees.password,
//     employees.profile_picture,
//     employees.roleID,
//     employees.departmentID,
//     employees.status,
//     employees.email,
//     role.role_name,
//     department.department_name
// FROM
//     employees
// JOIN
//     role ON employees.roleID = role.id
// JOIN
//     department ON employees.departmentID = department.id
// WHERE
//     employees.id = ?;
// `
//   db.query(q, [empID], (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

// app.post('/login', (req, res) => {
//   const sql = "SELECT * FROM employees WHERE username = ? and password = ? ";
//   db.query(sql, [req.body.username, req.body.password], (err, result) => {
//     if (err) return res.json({ Message: "Error inside server" })
//     if (result.length > 0) {
//       const userID = result[0].id;
//       const roleID = result[0].roleID;
//       const email = result[0].email

//       req.session.username = result[0].username;
//       req.session.user_id = userID;
//       req.session.role_id = roleID;
//       req.session.email = email
//       console.log(req.session.username);
//       return res.json({ Login: true, username: req.session.username, id: req.session.user_id, roleID: req.session.role_id, email: req.session.email })
//     } else {
//       return res.json({ Login: false })
//     }
//   })
// })

// app.get('/category', (req, res) => {
//   const sql = 'SELECT * FROM category';
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error executing query: ', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.json(results);
//   });
// });

// app.get('/employees', (req, res) => {
//   const sql = ` SELECT employees.id, employees.username, employees.password, employees.profile_picture,employees.roleID,employees.departmentID, employees.status, role.role_name,employees.email, department.department_name 
// FROM 
// employees 
// JOIN role ON employees.roleID = role.id 
// JOIN department ON employees.departmentID = department.id`;
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error executing query: ', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     res.json(results);
//   });
// });

// app.get('/items', (req, res) => {
//   const categoryId = req.query.category;

//   if (!categoryId) {
//     res.status(400).json({ error: 'Category ID is required' });
//     return;
//   }

//   const sql = `
//       SELECT 
//         item.*,
//         category.category_name,
//         supplier.first_name
//       FROM 
//         item
//       JOIN 
//         category ON item.categoryID = category.id
//       JOIN 
//         supplier ON item.supplierID = supplier.id
//       WHERE 
//         item.categoryID = ?`;

//   db.query(sql, [categoryId], (err, results) => {

//     err ? console.error("Error: ", err) : res.json(results);

//   });
// });

// app.get('/number-category', (req, res) => {
//   const sql = "SELECT COUNT(*) AS category_count FROM category";

//   db.query(sql, (error, result) => {
//     if (error) {
//       console.error("Error querying the database:", error);
//       return res.status(500).send("Internal Server Error");
//     }

//     // Check if result is not empty
//     if (result && result.length > 0) {
//       // Send the result back to the client
//       res.json({ categoryCount: result[0].category_count });
//     } else {
//       res.status(500).send("Internal Server Error: No data returned from the database query");
//     }
//   });
// });

// app.get('/', (req, res) => {
//   // console.log("Session", req.session.username);
//   if (req.session.username) {
//     return res.json({ valid: true, username: req.session.username });
//   }
//   else {
//     return res.json({ valid: false })
//   }
// })

// app.get('/number-item', (req, res) => {
//   const sql = "SELECT COUNT(*) AS item_count FROM item";
//   db.query(sql, (error, result) => {
//     if (error) {
//       console.error("Error querying the database:", error);
//       return res.status(500).send("Internal Server Error");
//     } else {
//       // Send the result back to the client
//       res.json({ itemCount: result[0].item_count });
//     }
//   });
// });

// app.get('/number-employee', (req, res) => {
//   const sql = "SELECT COUNT(*) AS employee_count FROM employees";
//   db.query(sql, (error, result) => {
//     if (error) {
//       console.error("Error querying the database:", error);
//       return res.status(500).send("Internal Server Error");
//     } else {
//       // Send the result back to the client
//       res.json({ employeeCount: result[0].employee_count });
//     }
//   });
// });

// app.get('/number-request', (req, res) => {
//   const sql = "SELECT COUNT(*) AS request_count FROM request_employee";
//   db.query(sql, (error, result) => {
//     if (error) {
//       console.error("Error querying the database:", error);
//       return res.status(500).send("Internal Server Error");
//     } else {
//       // Send the result back to the client
//       res.json({ requestCount: result[0].request_count });
//     }
//   });
// });

// app.get('/number-supplier', (req, res) => {
//   const sql = "SELECT COUNT(*) AS supplier_count FROM supplier";
//   db.query(sql, (error, result) => {
//     if (error) {
//       console.error("Error querying the database:", error);
//       return res.status(500).send("Internal Server Error");
//     } else {
//       // Send the result back to the client
//       res.json({ supplierCount: result[0].supplier_count });
//     }
//   });
// });

// app.post('/category', (req, res) => {
//   const q = 'INSERT INTO category (category_name, description) VALUES (?)';
//   const values = [
//     req.body.category_name,
//     req.body.description
//   ]
//   db.query(q, [values], (err, data) => {
//     if (err) {
//       console.error("Error Inserting", err);
//       return res.status(500).json({ error: "internal server error" })
//     } else {
//       console.log("Supplier added well", data);
//       return res.json(data)
//     }
//   })
// })

// app.post('/supplier', (req, res) => {
//   const q = 'INSERT INTO supplier (first_name, address, phone, email, status) VALUES (?)';
//   const values = [
//     req.body.first_name,
//     req.body.address,
//     req.body.phone,
//     req.body.email,
//     req.body.status
//   ]
//   db.query(q, [values], (err, data) => {
//     if (err) {
//       console.error("Error inserting", err);
//       return res.status(500).json({ error: "Internal Server Error" })
//     } else {
//       console.log("Supplier Number added well", data);
//       return res.json(data)
//     }
//   })
// })

// app.get('/supplier', (req, res) => {
//   const q = "SELECT * FROM supplier";
//   db.query(q, (error, result) => {
//     if (error) {
//       console.error("Error querying the database:", error);
//       return res.status(500).send("Internal Server Error");
//     } else {
//       res.json(result)
//     }
//   })
// });

// app.put('/supplier/:id', (req, res) => {
//   const id = req.params.id;

//   const query = `UPDATE supplier SET supplier first_name = ?, address = ?, phone = ?, email = ?, status = ? WHERE id = ?`;

//   const values = [
//     req.body.first_name,
//     req.body.address.
//       req.body.phone,
//     req.body.email,
//     req.body.status,
//     id
//   ];
//   console.log("Values: ", values);
// })

// app.post('/add-serial-number/:takeItemID', (req, res) => {
//   34
//   const itemID = req.params.takeItemID;
//   const status = 'In';
//   console.log("Status is: ", status);
//   const q = "INSERT INTO serial_number (serial_number, state_of_item, depreciation_rate, itemID, status, taker, quantity ) VALUES (?,?,?,?,?,NULL,1)";
//   const values = [
//     req.body.serial_number,
//     req.body.state_of_item,
//     req.body.depreciation_rate,
//     itemID,
//     status
//   ]
//   db.query(q, values, (err, data) => {
//     if (err) {
//       console.error("Error inserting", err);
//       return res.status(500).json({ error: "Internal Server Error" })
//     }
//     console.log("Serial number added well", data)
//     return res.json(data)
//   });

// });

// app.get('/serial-number/:itemID', (req, res) => {
//   const itemID = req.params.itemID;

//   const q1 = `
//     SELECT
//       item.name AS itemName
//     FROM
//       serial_number
//     JOIN
//       item ON serial_number.itemId = item.id
//     WHERE
//       serial_number.itemId = ?;
//   `;

//   const q2 = `
//     SELECT
//       serial_number,
//       state_of_item,
//       date
//     FROM
//       serial_number
//     WHERE
//       itemId = ?;
//   `;

//   db.query(q1, [itemID], (err, result1) => {
//     if (err) {
//       console.error('Error fetching item name:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }

//     // Check if result1 has rows before accessing them
//     if (result1 && result1.length > 0) {
//       const itemName = result1[0].itemName;

//       db.query(q2, [itemID], (err, result2) => {
//         if (err) {
//           console.error('Error fetching serial numbers:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//           return;
//         }

//         const serialNumbers = result2;

//         res.json({
//           itemName: { itemName },
//           serialNumbers: { serialNumbers },
//           totalSerialCount: serialNumbers.length,
//         });
//       });
//     } else {
//       // Handle the case where result1 is empty
//       res.status(404).json({ error: 'Item not found' });
//     }
//   });
// });

// app.get('/get-serial-number/:itemID', (req, res) => {
//   const itemID = req.params.itemID;
//   const q = 'SELECT * FROM serial_number WHERE itemID = ?';
//   const values = [
//     itemID
//   ];
//   db.query(q, [values], (err, result) => {
//     if (err) {
//       console.error('Error fetching item : ', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }
//     return res.json(result)
//   })
// })

// app.get('/get-name-serial-number/:itemID', (req, res) => {
//   const itemID = req.params.itemID;
//   const q = `
//   SELECT
//     serial_number.*,
//     item.name AS itemName
//   FROM
//     serial_number
//   JOIN
//     item ON serial_number.itemID = item.id
//   WHERE
//     serial_number.itemID = ?;
// `;
//   const values = [
//     itemID
//   ]
//   db.query(q, [values], (err, result) => {
//     if (err) {
//       console.error('Error fetching item: ', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }
//     return res.json(result);
//   })
// })

// app.put('/update-item/:itemID', (req, res) => {
//   const id = req.params.itemID;
//   const newItemName = req.body.newItemName;
//   const newSupplierID = req.body.newSupplierID;
//   const newCategoryID = req.body.newCategoryID;
//   const employeeUpdateName = req.body.employeeUpdateName;

//   console.log("Sum", newItemName);
//   console.log("Sum", newSupplierID);
//   console.log("Sum", newCategoryID);

//   const date = new Date();

//   const currentTimeString = date.toLocaleDateString();

//   const updateQuery = 'UPDATE item SET name = ?, supplierID = ?, categoryID = ?, updatedtime = ?, nameUpdated	= ? WHERE id = ?';
//   const updateValues = [newItemName, newSupplierID, newCategoryID, currentTimeString, employeeUpdateName, id];

//   db.query(updateQuery, updateValues, (err3) => {
//     if (err3) {
//       console.error('Error updating item:', err3);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     res.json({ message: 'Item updated successfully' });
//   });
// });


// app.delete('/delete-item/:itemID', (req, res) => {
//   const itemID = req.params.itemID;
//   const q = `DELETE FROM item WHERE id = ?`;
//   db.query(q, [itemID], (err, result) => {
//     if (err) {
//       console.error("Error", err);
//     } else {
//       console.log("Result :", result);
//       return result;
//     }
//   })
// });

// app.put('/update-serial-item/:id', (req, res) => {
//   const id = req.params.id;
//   console.log("ID: ", id);
//   const q = `UPDATE serial_number SET serial_number = ?, state_of_item = ?, depreciation_rate = ? WHERE id = ?`;
//   const values = [
//     req.body.serial_number,
//     req.body.state_of_item,
//     req.body.depreciation_rate,
//     id
//   ];

//   db.query(q, values, (error, result) => {
//     if (error) {
//       console.error("Error :", error);
//     } else {
//       console.log("Done right")
//       return result
//     }
//   })

// })

// app.delete('/delete-serial-item/:id', async (req, res) => {
//   const id = req.params.id;

//   // const Check = async (id) => {
//   //   return new Promise((resolve, reject) => {
//   //     const q = `SELECT status FROM serial_number WHERE id = ?`;
//   //     const value = [id];
//   //     db.query(q, value, (error, result) => {
//   //       if (error) {
//   //         console.error("Error", error);
//   //       } else {
//   //         console.log(result);
//   //         resolve(result);
//   //       }
//   //     })
//   //   })
//   // }
//   // const word = await Check(id);
//   // if (word === "In") {
//   //   const message = "Cannot delete"
//   //   return message;
//   // } else {
//   //   const q = `DELETE FROM serial_number WHERE id = ? `;
//   //   db.query(q, [id], (error, result) => {
//   //     if (error) {
//   //       console.error("Error", error);
//   //     } else {
//   //       console.log("Done well", result)
//   //     };
//   //   });
//   // };

//   const q = "DELETE FROM serial_number WHERE id = ?";

//   db.query(q, [id], (error, result) => {
//     // result ? console.log("Deleted Successfully") 
//     if (error) console.error("Error: ", error);
//   });
// });

// app.put('/deactivate-employee/:id', (req, res) => {
//   const id = req.params.id;
//   const q = `UPDATE employees SET status = ? WHERE id = ?`;
//   const deactivate = req.body.status;
//   const values = [
//     deactivate,
//     id
//   ]
//   db.query(q, values, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//     } else {
//       // console.log("Done did: ", result);
//       // return result;
//     }
//   });
// });

// app.delete('/delete-employee/:id', (req, res) => {
//   const id = req.params.id;
//   const q = `DELETE FROM employees WHERE id = ?`;
//   db.query(q, id, (error) => {
//     if (error) {
//       console.error("Error ", error)
//     }
//   })
// })

// app.get('/items/:categoryID', (req, res) => {
//   const categoryID = req.params.categoryID;
//   console.log("CategoryID: ", categoryID);
//   const q = 'SELECT * FROM item WHERE categoryID = ?';
//   db.query(q, categoryID, (error, result) => {
//     error ? console.error("Error: ", error) : res.json(result);
//     console.log("This passed successfully");
//   })
// })

// app.get('/serial-number', (req, res) => {
//   const q = 'SELECT * FROM serial_number';
//   db.query(q, (error, result) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       console.log("Type OF", typeof result);
//       return res.json(result);
//     }
//   })
// })

// app.get('/get-total-number/:id', (req, res) => {
//   const id = req.params.id;
//   console.log('ID: ', id);
//   const q = `SELECT * FROM serial_number WHERE itemID = ?`;
//   db.query(q, id, (error, result) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       res.json({ totalCount: result.length });
//     }
//   })

// })

// app.put('/update-serial-status/:id/:status', (req, res) => {
//   const id = req.params.id
//   const status = req.params.status
//   console.log("Status: ", status);
//   console.log("ID: ", id);
//   const q = `UPDATE serial_number set status = ? WHERE id = ?`;
//   const values = [status, id]
//   db.query(q, values, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//     } else {
//       return result;
//     }
//   })
// })

// app.put('/update-serial-status/:id/:status/:taker', async (req, res) => {
//   const id = req.params.id
//   const status = req.params.status
//   const taker = req.params.taker
//   console.log("Status: ", status);
//   console.log("ID: ", id);
//   console.log("Taker Name: ", taker);

//   const getEmployeeID = (id) => {
//     return new Promise((resolve, reject) => {
//       const q = `SELECT id FROM employees WHERE username = ?`;
//       const value = [id];

//       db.query(q, value, (error, result) => {
//         if (error) {
//           console.error("error", error);
//           reject(error);
//         } else {
//           console.log("Result", result);
//           resolve(result);
//         }
//       });
//     });
//   };

//   try {
//     const result = await getEmployeeID(taker);
//     const takerID = result[0].id;
//     console.log("Taker ID: ", takerID);

//     if (takerID !== null) {
//       const updateQuery = `UPDATE serial_number SET status = ?, taker = ?, quantity = GREATEST(quantity - 1, 0) WHERE id = ?`;
//       const updateValues = [status, takerID, id];

//       db.query(updateQuery, updateValues, (error, updateResult) => {
//         if (error) {
//           console.error("Error", error);
//           res.status(500).json({ error: "Internal Server Error" });
//         } else {
//           console.log("Update Result", updateResult);
//           res.status(200).json({ message: "Update successful" });
//         }
//       });
//     } else {
//       res.status(404).json({ error: "Taker not found" });
//     }
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // app.get('/get-serial-status/:id'

// app.get('/monthly-report/:StartDate/:EndDate', (req, res) => {
//   const start = req.params.StartDate;
//   const end = req.params.EndDate;
//   console.log("Start from front: ", start);
//   console.log("end from front: ", end);
//   const query = `
//   SELECT 
//   DATE_FORMAT(serial_number.date, '%Y-%m-%d') AS transaction_date,
//   item.name AS item_name,
//   COALESCE(SUM(CASE WHEN serial_number.status = 'In' THEN 1 ELSE 0 END), 0) AS amount_entered,
//   COALESCE(SUM(CASE WHEN serial_number.status = 'Out' THEN 1 ELSE 0 END), 0) AS amount_went_out,
//   employees.username AS taker_name,
//   COALESCE((SELECT COUNT(*) FROM serial_number s WHERE s.status = 'In' AND s.itemID = item.id), 0) AS total_items_in
// FROM serial_number
// JOIN item ON serial_number.itemID = item.id
// LEFT JOIN employees ON serial_number.taker = employees.id
// WHERE serial_number.date >= ? AND serial_number.date <= ? -- Specify your date range here
// GROUP BY transaction_date, item.name, employees.username, item.id
// ORDER BY serial_number.date DESC; -- Order by date in descending order

//   `;
//   const startDate = moment(req.query.start, 'DD-MM-YYYY').format('YYYY-MM-DD');
//   const endDate = moment(req.query.end, 'DD-MM-YYYY').format('YYYY-MM-DD');
//   const values = [start, end];
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


// app.post('/add-department', (req, res) => {
//   const q = 'INSERT INTO department(department_name, status) VALUES (?,?)';
//   const values = [
//     req.body.department_name,
//     req.body.status
//   ]
//   db.query(q, values, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//     } else {
//       console.log("Done Well");
//       return result;
//     }
//   })
// })

// app.post('/add-role/:deptID', async (req, res) => {
//   try {
//     const gotDepartmentName = req.params.deptID;
//     console.log("DeptID", gotDepartmentName);
//     const q = "INSERT INTO role(role_name, departmentID, status) VALUES(?, ?, ?)";
//     const values = [req.body.role_name, gotDepartmentName, req.body.status];
//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error("Error", err);
//       } else {
//         // console.log(data);
//         res.status(200).send("Role successfully inserted");
//       }
//     })
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// })

// app.get('/get-department', (req, res) => {
//   const q = 'SELECT * FROM department;';
//   db.query(q, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//     } else {
//       // console.log("Data", result);
//       return res.json(result)
//     }
//   })
// })

// app.get('/employee', (req, res) => {
//   const q = 'SELECT * FROM employees';
//   db.query(q, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//     } else {
//       console.log(result)
//     }
//   })
// });

// app.get('/get-role/:deptID', (req, res) => {
//   const deptID = req.params.deptID;
//   const q = `SELECT * FROM role WHERE departmentID = ?`;
//   db.query(q, deptID, (error, result) => {
//     if (error) {
//       console.error("error", error);
//     }
//     return res.json(result);
//   })
// })

// app.post('/add-request-employee-supervisor', async (req, res) => {
//   // const getEmployeeID = (employeeName) => {
//   //   return new Promise((resolve, reject) => {
//   //     const sql = `SELECT id FROM employees WHERE username = ?`;
//   //     db.query(sql, [employeeName], (error, result) => {
//   //       if (error) {
//   //         console.error(error);
//   //         reject(error);
//   //       } else {
//   //         const employeeID = result.length > 0 ? result[0].id : null;
//   //         // console.log("Employee ID", employeeID);
//   //         resolve(employeeID);
//   //       }
//   //     });
//   //   });
//   // };

//   // const getItemID = (itemName) => {
//   //   return new Promise((resolve, reject) => {
//   //     const sql = `SELECT id FROM item WHERE name = ?`;
//   //     db.query(sql, [itemName], (error, result) => {
//   //       if (error) {
//   //         console.error(error);
//   //         reject(error);
//   //       } else {
//   //         const itemID = result.length > 0 ? result[0].id : null;
//   //         // console.log("Item ID", itemID);
//   //         resolve(itemID);
//   //       }
//   //     });
//   //   });
//   // };

//   // const getCategoryID = (categoryName) => {
//   //   return new Promise((resolve, reject) => {
//   //     const sql = `SELECT id FROM category WHERE category_name = ?`;
//   //     db.query(sql, [categoryName], (error, result) => {
//   //       if (error) {
//   //         console.error(error);
//   //         reject(error);
//   //       } else {
//   //         const categoryName = result.length > 0 ? result[0].id : null;
//   //         // console.log("Item ID", categoryName);
//   //         resolve(categoryName);
//   //       }
//   //     });
//   //   });
//   // }

//   // try {
//   //   const gotEmployeeName = req.body.employeeName;
//   //   const employeeID = await getEmployeeID(gotEmployeeName);
//   //   // console.log("Employee ID: ", employeeID);

//   //   const gotItemName = req.body.itemName;
//   //   const itemID = await getItemID(gotItemName);
//   //   // console.log("Item ID: ", itemID);

//   //   const gotCategoryName = req.body.categoryName;
//   //   const categoryID = await getCategoryID(gotCategoryName);
//   //   // console.log("Category ID: ", categoryID);

//   //   const status = 'Pending'

//   //   const q =
//   //     "INSERT INTO employee_supervisor_request (categoryID,	itemID,	employeeID,	description,	date_of_request,	status,	amount	) VALUES (?, ?, ?, ?, ?, ?, ? )";
//   //   const values = [categoryID, itemID, employeeID, req.body.description, req.body.date, status, req.body.count];

//   //   db.query(q, values, (err, data) => {
//   //     if (err) {
//   //       console.error(err);
//   //       res.status(500).send("Internal Server Error");
//   //     } else {
//   //       id = data.insertId;
//   //       // console.log("This is the id ", id);
//   //       return id;
//   //       // res.status(200).send("Request successfully inserted");
//   //     }
//   //   });
//   // } catch (error) {
//   //   console.error(error);
//   //   res.status(500).send("Internal Server Error");
//   // }
// });

// app.get('/get-request-employee-supervisor', async (req, res) => {

//   try {

//     const q =
//       `SELECT
//       e.username,
//       c.category_name,
//       i.name AS itemName,
//       esr.description,
//       esr.date_of_request AS date,
//       esr.status,
//       esr.amount
//   FROM
//       employee_supervisor_request esr
//   JOIN
//       employees e ON esr.employeeID = e.id
//   JOIN
//       category c ON esr.categoryID = c.id
//   JOIN
//       item i ON esr.itemID = i.id;
//   ;
//   `;

//     db.query(q, (err, data) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//       } else {
//         console.log("data", data);
//         return res.json(data);
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// })

// app.post('/add-request-supervisor-hr/:supervisorID', async (req, res) => {

//   const getEmployeeID = (employeeName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM employees WHERE username = ?`;
//       db.query(sql, [employeeName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const employeeID = result.length > 0 ? result[0].id : null;
//           console.log("Employee ID", employeeID);
//           resolve(employeeID);
//         }
//       });
//     });
//   };

//   const getItemID = (itemName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM item WHERE name = ?`;
//       db.query(sql, [itemName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const itemID = result.length > 0 ? result[0].id : null;
//           console.log("Item ID", itemID);
//           resolve(itemID);
//         }
//       });
//     });
//   };

//   const getCategoryID = (categoryName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM category WHERE category_name = ?`;
//       db.query(sql, [categoryName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const categoryName = result.length > 0 ? result[0].id : null;
//           console.log("Item ID", categoryName);
//           resolve(categoryName);
//         }
//       });
//     });
//   }

//   try {
//     const gotEmployeeName = req.body.username;
//     const employeeID = await getEmployeeID(gotEmployeeName);
//     console.log("Employee ID: ", employeeID);

//     const gotItemName = req.body.name;
//     const itemID = await getItemID(gotItemName);
//     console.log("Item ID: ", itemID);

//     const gotCategoryName = req.body.category_name;
//     const categoryID = await getCategoryID(gotCategoryName);
//     console.log("Category ID: ", categoryID);

//     const status = 'Pending'

//     const supervisorID = req.params.supervisorID;
//     const email = req.body.email;
//     const priority = req.body.priority;

//     const q = "INSERT INTO supervisor_hr_request (supervisorID,employeeID,itemID,categoryID,description,date_approved,amount,email,status, priority) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
//     const values = [supervisorID, employeeID, itemID, categoryID, req.body.description, req.body.date_of_request, req.body.amount, email, status, priority];
//     console.log("Values: ", values);

//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//       } else {
//         // console.log(data);
//         res.status(200).send("Request successfully inserted");
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// })

// // app.post('/add-request-hr-stock', (req,res)=>{

// //   const getEmployeeID = (employeeName) => {
// //     return new Promise((resolve, reject) => {
// //       const sql = `SELECT id FROM employees WHERE username = ?`;
// //       db.query(sql, [employeeName], (error, result) => {
// //         if (error) {
// //           console.error(error);
// //           reject(error);
// //         } else {
// //           const employeeID = result.length > 0 ? result[0].id : null;
// //           console.log("Employee ID", employeeID);
// //           resolve(employeeID);
// //         }
// //       });
// //     });
// //   };

// //   const getItemID = (itemName) => {
// //     return new Promise((resolve, reject) => {
// //       const sql = `SELECT id FROM item WHERE name = ?`;
// //       db.query(sql, [itemName], (error, result) => {
// //         if (error) {
// //           console.error(error);
// //           reject(error);
// //         } else {
// //           const itemID = result.length > 0 ? result[0].id : null;
// //           console.log("Item ID", itemID);
// //           resolve(itemID);
// //         }
// //       });
// //     });
// //   };

// //   const getCategoryID = (categoryName) => {
// //     return new Promise((resolve, reject) => {
// //       const sql = `SELECT id FROM category WHERE category_name = ?`;
// //       db.query(sql, [categoryName], (error, result) => {
// //         if (error) {
// //           console.error(error);
// //           reject(error);
// //         } else {
// //           const categoryName = result.length > 0 ? result[0].id : null;
// //           console.log("Item ID", categoryName);
// //           resolve(categoryName);
// //         }
// //       });
// //     });
// //   }

// //   const getSupervisorID = (supervisorName) => {
// //     return new Promise((resolve, reject) => {
// //       const sql = `SELECT id FROM employees WHERE username = ?`;
// //       db.query(sql, [supervisorName], (error, result) => {
// //         if (error) {
// //           console.error(error);
// //           reject(error);
// //         } else {
// //           const supervisorID = result.length > 0 ? result[0].id : null;
// //           console.log("Supervisor ID", supervisorID);
// //           resolve(supervisorID);
// //         }
// //       });
// //     });
// //   }

// //   try {
// //     const gotEmployeeName = req.body[0].employeeName;
// //     const employeeID = await getEmployeeID(gotEmployeeName);
// //     console.log("Employee ID: ", employeeID);

// //     const gotItemName = req.body[0].itemName;
// //     const itemID = await getItemID(gotItemName);
// //     console.log("Item ID: ", itemID);

// //     const gotCategoryName = req.body[0].categoryName;
// //     const categoryID = await getCategoryID(gotCategoryName);
// //     console.log("Category ID: ", categoryID);

// //     const status = 'Pending'

// //     const supervisorID = req.params.supervisorID;

// //     const q =
// //     "INSERT INTO supervisor_hr_request (supervisorID,	employeeID,	itemID,	categoryID,	description, date_approved,	amount,	status	) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )";
// //     const values = [supervisorID, employeeID, itemID, categoryID, req.body[0].description, req.body[0].date, req.body[0].count, status];
// //     console.log("Values: ", values);

// //     db.query(q, values, (err, data) => {
// //       if (err) {
// //         console.error(err);
// //         res.status(500).send("Internal Server Error");
// //       } else {
// //         console.log(data);
// //         res.status(200).send("Request successfully inserted");
// //       }
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).send("Internal Server Error");
// //   }

// // })

// app.put('/approve-by-supervisor/:index', (req, res) => {
//   const id = req.params.index;
//   const approve = "Approved";
//   const values = [approve, id];
//   const update1 = "UPDATE employee_supervisor_request set status = ? WHERE id = ?";

//   db.query(update1, values, (error, result) => {
//     if (error) {
//       console.error("Error", error)
//     } else {
//       return result;
//     }
//   })
// })

// app.put('/deny-by-supervisor/:index', (req, res) => {
//   const id = req.params.index;
//   const approve = "Denied By Supervisor";
//   const values = [approve, id];
//   const update1 = "UPDATE employee_supervisor_request set status = ? WHERE id = ?";

//   db.query(update1, values, (error, result) => {
//     if (error) {
//       console.error("Error", error)
//     } else {
//       console.log("Denied Well !!!");
//       return result;
//     }
//   })
// });

// app.put('/deny-by-supervisor-purchase/:index', (req, res) => {
//   const id = req.params.index;
//   const approve = "Denied By Supervisor";
//   const values = [approve, id];
//   const update1 = "UPDATE employee_supervisor_purchase set status = ? WHERE id = ?";

//   db.query(update1, values, (error, result) => {
//     if (error) {
//       console.error("Error", error)
//     } else {
//       console.log("Denied Well !!!");
//       return result;
//     }
//   })
// })

// app.get('/get-number', (req, res) => {
//   const sql = "SELECT id FROM employee_supervisor_request ORDER BY id DESC LIMIT 1";
//   db.query(sql, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       if (result.length > 0) {
//         const latestId = result[0].id;
//         return res.json({ latestId });
//       } else {
//         return res.json({ latestId: null });
//       }
//     }
//   });
// });

// app.get('/get-number-purchase', (req, res) => {
//   const sql = "SELECT id FROM employee_supervisor_purchase ORDER BY id DESC LIMIT 1";
//   db.query(sql, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       if (result.length > 0) {
//         const latestId = result[0].id;
//         return res.json({ latestId });
//       } else {
//         return res.json({ latestId: null });
//       }
//     }
//   });
// });

// app.get('/get-all-requests/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = `SELECT item.name, category.category_name, employees.username, employee_supervisor_request.date_of_request, employee_supervisor_request.id,employee_supervisor_request.status
//   FROM employee_supervisor_request
//   JOIN item ON employee_supervisor_request.itemID = item.id
//   JOIN employees ON employee_supervisor_request.supervisor_concerned = employees.id
//   JOIN category ON employee_supervisor_request.categoryID = category.id
//   WHERE employee_supervisor_request.employeeID = ?;
//   `;
//   db.query(sql, id, (error, result) => {
//     if (error) {
//       console.error("Error", error);
//     } else {
//       const response = result;
//       return res.json(response);
//     }
//   })
// })

// app.delete('/delete', (req, res) => {
//   const sql = "DELETE * FROM employee_supervisor_request WHERE employeeID = 6";
//   db.query(sql, (error, result) => {
//     if (result) console.log("Done", result)
//   })
// })

// app.get('/get-supervisor-name/:supervisorID', (req, res) => {
//   const supervisorID = req.params.supervisorID;
//   const sql = 'SELECT name FROM employees WHERE id = ?'
//   db.query(sql, [supervisorID], (error, result) => {
//     if (error) {
//       console.error("Error", error);
//     } else {
//       return res.json(result);
//     }
//   })
// });

// app.post('/post-by-hr', async (req, res) => {

//   console.log("Endppoint hit~~~!!!");

//   const getEmployeeID = (employeeName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM employees WHERE username = ?`;
//       db.query(sql, [employeeName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const employeeID = result.length > 0 ? result[0].id : null;
//           resolve(employeeID);
//         }
//       });
//     });
//   };

//   const getItemID = (itemName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM item WHERE name = ?`;
//       db.query(sql, [itemName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const itemID = result.length > 0 ? result[0].id : null;
//           resolve(itemID);
//         }
//       });
//     });
//   };

//   const getCategoryID = (categoryName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM category WHERE category_name = ?`;
//       db.query(sql, [categoryName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const categoryName = result.length > 0 ? result[0].id : null;
//           resolve(categoryName);
//         }
//       });
//     });
//   };

//   const getSupervisorID = (supervisorName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM employees WHERE username = ?`;
//       db.query(sql, [supervisorName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const supervisorID = result.length > 0 ? result[0].id : null;
//           resolve(supervisorID);
//         }
//       });
//     });
//   };

//   const id = req.body.id;
//   const itemName = req.body.name;
//   const amount = req.body.amount;
//   const description = req.body.description;
//   const categoryName = req.body.category_name;
//   const employeeName = req.body.employee_username;
//   const supervisorName = req.body.supervisor_username;

//   const employee = await getEmployeeID(employeeName);
//   const item = await getItemID(itemName);
//   const category = await getCategoryID(categoryName);
//   const supervisor = await getSupervisorID(supervisorName);

//   const sql = `INSERT INTO hr_admin_request (id,categoryID,itemID,amount,supervisorID,description,employeeID) VALUES (?, ?, ?, ?, ?, ?, ? )`;

//   const values = [id, category, item, amount, supervisor, description, employee];

//   db.query(sql, values, (error, result) => {
//     if (error) {
//       console.error("ERROR", error);
//     } else {
//       console.log(result)
//     }
//   })
// })

// app.post('/insert-doer/:itemID/:employeeID', (req, res) => {
//   console.log("Endpoint hit~~~~~");
//   const itemID = req.params.itemID;
//   const employeeID = req.params.employeeID;
//   const action = "Updated";

//   const sql = `INSERT INTO item_deletion_or_updation (itemID,employeeID,action) VALUES (?, ?, ?)`;

//   const values = [itemID, employeeID, action];

//   db.query(sql, values, (error, result) => {
//     if (error) {
//       console.error("Error", error)
//     }
//   })
// })

// app.post('/insert-deletion-doer/:itemID/:employeeID', (req, res) => {
//   console.log("Endpoint hit~~~~~");
//   const itemID = req.params.itemID;
//   const employeeID = req.params.employeeID;
//   const action = "Deleted";

//   const sql = `INSERT INTO item_deletion_or_updation (itemID,employeeID,action) VALUES (?, ?, ?)`;

//   const values = [itemID, employeeID, action];

//   db.query(sql, values, (error, result) => {
//     if (error) {
//       console.error("Error", error)
//     }
//   })
// });

// app.get('/get-action-transaction', (req, res) => {
//   const get =
//     `
//     SELECT 
//     item_deletion_or_updation.itemID AS item_id,
//     item.name AS item_name,
//     item_deletion_or_updation.employeeID AS employee_id,
//     employees.username AS employee_username,
//     item_deletion_or_updation.action 
// FROM
//     item_deletion_or_updation
// LEFT JOIN
//     item ON item_deletion_or_updation.itemID = item.id
// LEFT JOIN
//     employees ON item_deletion_or_updation.employeeID = employees.id
// ORDER BY
//     item_deletion_or_updation.id DESC;


//    `;
//   //  SELECT item.name, employees.username, item_deletion_or_updation.action
//   // FROM item_deletion_or_updation
//   // JOIN item ON item_deletion_or_updation.itemID = item.id
//   // JOIN employees ON item_deletion_or_updation.employeeID = employees.id

//   db.query(get, (error, result) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       return res.json(result);
//     }
//   })
// });

// app.get('/get-approved-notification', (req, res) => {
//   const q = ` SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount,employee_supervisor_request.priority, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
//   FROM employee_supervisor_request
//   JOIN employees ON employee_supervisor_request.employeeID = employees.id
//   JOIN category ON employee_supervisor_request.categoryID = category.id
//   JOIN item ON employee_supervisor_request.itemID = item.id
//  WHERE employee_supervisor_request.status = 'Approved By Supervisor'
//   ORDER BY employee_supervisor_request.id DESC;
// `;
//   db.query(q, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });



// app.get('/get-approved-notification-employee/:employeeID', (req, res) => {
//   const employeeID = req.params.employeeID;
//   const q = ` SELECT employees.username, category.category_name, item.name, employee_supervisor_request.amount, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
//   FROM employee_supervisor_request
//   JOIN employees ON employee_supervisor_request.employeeID = employees.id
//   JOIN category ON employee_supervisor_request.categoryID = category.id
//   JOIN item ON employee_supervisor_request.itemID = item.id
//  WHERE (employee_supervisor_request.status = 'Approved' OR employee_supervisor_request.status'Approved By Supervisor') AND employee_supervisor_request.employeeID = ?
//   ORDER BY employee_supervisor_request.id DESC;
// `;
//   db.query(q, [employeeID], (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-denied-notification', (req, res) => {
//   const q = ` SELECT employees.username, category.category_name, item.name, employee_supervisor_request.priority, employee_supervisor_request.amount, employee_supervisor_request.priority, employee_supervisor_request.description, employee_supervisor_request.date_of_request,employee_supervisor_request.email ,employee_supervisor_request.status , employee_supervisor_request.id
//   FROM employee_supervisor_request
//   JOIN employees ON employee_supervisor_request.employeeID = employees.id
//   JOIN category ON employee_supervisor_request.categoryID = category.id
//   JOIN item ON employee_supervisor_request.itemID = item.id
//  WHERE employee_supervisor_request.status = 'Denied By Supervisor'
//   ORDER BY employee_supervisor_request.id DESC;
// `;
//   db.query(q, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-denied-notification-purchase-employee/:employeeID', (req, res) => {
//   const id = req.params.employeeID;
//   const q = ` SELECT employees.username,employee_supervisor_purchase.expenditure_line, employee_supervisor_purchase.amount, employee_supervisor_purchase.cost_method, employee_supervisor_purchase.end_goal, employee_supervisor_purchase.priority, employee_supervisor_purchase.date, employee_supervisor_purchase.email, employee_supervisor_purchase.status
//   FROM employee_supervisor_purchase
//   JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
//   WHERE (employee_supervisor_purchase.status = 'Denied' OR employee_supervisor_purchase.status = 'Denied By Supervisor') AND employee_supervisor_purchase.employeeID = ?
//   ORDER BY employee_supervisor_purchase.id DESC;
// `;
//   db.query(q, [id], (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-denied-notification-purchase-supervisor/:supervisorID', (req, res) => {
//   const id = req.params.supervisorID;
//   const q = ` SELECT employees.username,employee_supervisor_purchase.expenditure_line, employee_supervisor_purchase.amount, employee_supervisor_purchase.cost_method, employee_supervisor_purchase.end_goal, employee_supervisor_purchase.priority, employee_supervisor_purchase.date, employee_supervisor_purchase.email, employee_supervisor_purchase.status
//   FROM employee_supervisor_purchase
//   JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
//   WHERE (employee_supervisor_purchase.status = 'Denied' OR employee_supervisor_purchase.status = 'Denied by supervisor') AND employee_supervisor_purchase.supervisor = ?
//   ORDER BY employee_supervisor_purchase.id DESC;
// `;
//   db.query(q, [id], (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-pending-notifications', (req, res) => {

//   const sql = `SELECT 
//   employees.username AS employee_username, 
//   supervisor.username AS supervisor_username,
//   supervisor_hr_request.amount, 
//   supervisor_hr_request.description, 
//   supervisor_hr_request.date_approved, 
//   supervisor_hr_request.id, 
//   supervisor_hr_request.supervisorID,
//   supervisor_hr_request.email,
//   supervisor_hr_request.priority,
//   supervisor_hr_request.status,
//   category.category_name,
//   item.name
// FROM 
//   supervisor_hr_request
// JOIN 
//   employees ON supervisor_hr_request.employeeID = employees.id
// JOIN 
//   employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
// JOIN 
//   category ON supervisor_hr_request.categoryID = category.id
// JOIN 
//   item ON supervisor_hr_request.itemID = item.id
//   WHERE  supervisor_hr_request.status = 'Pending'
// ORDER BY 
//   supervisor_hr_request.id DESC;
// `
//   db.query(sql, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-approved-notifications', (req, res) => {

//   const sql = `SELECT 
//   employees.username AS employee_username, 
//   supervisor.username AS supervisor_username,
//   supervisor_hr_request.amount, 
//   supervisor_hr_request.description, 
//   supervisor_hr_request.date_approved, 
//   supervisor_hr_request.id, 
//   supervisor_hr_request.supervisorID,
//   supervisor_hr_request.priority,
//   supervisor_hr_request.email,
//   supervisor_hr_request.status,
//   category.category_name,
//   item.name
// FROM 
//   supervisor_hr_request
// JOIN 
//   employees ON supervisor_hr_request.employeeID = employees.id
// JOIN 
//   employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
// JOIN 
//   category ON supervisor_hr_request.categoryID = category.id
// JOIN 
//   item ON supervisor_hr_request.itemID = item.id
//   WHERE  supervisor_hr_request.status = 'Approved'
// ORDER BY 
//   supervisor_hr_request.id DESC;
// `
//   db.query(sql, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-denied-notifications', (req, res) => {

//   const sql = `SELECT 
//   employees.username AS employee_username, 
//   supervisor.username AS supervisor_username,
//   supervisor_hr_request.amount, 
//   supervisor_hr_request.description, 
//   supervisor_hr_request.date_approved, 
//   supervisor_hr_request.id, 
//   supervisor_hr_request.supervisorID,
//   supervisor_hr_request.email,
//   supervisor_hr_request.priority,
//   supervisor_hr_request.status,
//   category.category_name,
//   item.name
// FROM 
//   supervisor_hr_request
// JOIN 
//   employees ON supervisor_hr_request.employeeID = employees.id
// JOIN 
//   employees AS supervisor ON supervisor_hr_request.supervisorID = supervisor.id
// JOIN 
//   category ON supervisor_hr_request.categoryID = category.id
// JOIN 
//   item ON supervisor_hr_request.itemID = item.id
//   WHERE  supervisor_hr_request.status = 'Denied'
// ORDER BY 
//   supervisor_hr_request.id DESC;
// `
//   db.query(sql, (error, result) => {
//     console.log("TYPE OF RESULT: ", typeof result);
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/show-supervisor', (req, res) => {
//   const q = `
//   SELECT username, id
//   FROM employees
//   WHERE roleID = 5;
//   ;`
//     ;
//   db.query(q, (error, data) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       return res.json(data);
//     }
//   })
// });

// app.delete('/delete-category/:id', (req, res) => {
//   const id = req.params.id;
//   const q = `DELETE FROM category
//   WHERE id = ?;
//   `;

//   db.query(q, [id], (error, result) => {
//     result ? console.log(result) : console.error("Error: ", error);
//   })
// });

// app.post('/add-employee-supervisor-purchase', (req, res) => {

//   const employeeID = req.body.employeeID;
//   const expenditure_line = req.body.description;
//   const amount = req.body.amount;
//   const cost = req.body.cost;
//   const supervisorID = req.body.supervisorID;
//   const endGoal = req.body.endGoalValue;
//   const quotation = req.body.file;
//   const priority = req.body.priority;
//   const email = req.body.email;
//   const status = "Pending";

//   const q = "INSERT INTO employee_supervisor_purchase (expenditure_line,amount,cost_method,supervisor,end_goal,priority,employeeID,email,status) VALUES (?,?,?,?,?,?,?,?,?)";

//   const values = [
//     expenditure_line,
//     amount,
//     cost,
//     supervisorID,
//     endGoal,
//     priority,
//     employeeID,
//     email,
//     status
//   ]

//   db.query(q, values, (error, result) => {
//     result ? console.log("Result: ", result) : console.error("Error: ", error);
//   });
// });

// app.get('/get-purchase-notification/:supervisorID', (req, res) => {
//   const id = req.params.supervisorID;
//   const sql = ` SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method,employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
//  FROM employee_supervisor_purchase
//  JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
// WHERE employee_supervisor_purchase.status = 'Pending' AND employee_supervisor_purchase.supervisor = ?
//  ORDER BY employee_supervisor_purchase.id DESC `;

//   const values = [id];
//   db.query(sql, values, (error, result) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       res.json(result);
//       // console.log("Type of quotation: ", result[0].quotation);
//     };
//   })
// });


// app.get('/get-approved-purchase-notification/:supervisorID', (req, res) => {
//   const id = req.params.supervisorID;
//   const sql = `SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method,employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
//   FROM employee_supervisor_purchase
//   JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
//   WHERE (employee_supervisor_purchase.status = 'Approved' OR employee_supervisor_purchase.status = 'Approved By Supervisor') AND employee_supervisor_purchase.supervisor = ?
//   ORDER BY employee_supervisor_purchase.id DESC; `;

//   const values = [id];
//   db.query(sql, values, (error, result) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       res.json(result);
//     };
//   })
// });

// app.get('/get-approved-purchase-notification-employee/:employeeID', (req, res) => {
//   const id = req.params.employeeID;
//   const sql = ` SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method,employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
//  FROM employee_supervisor_purchase
//  JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
// WHERE (employee_supervisor_purchase.status = 'Approved By Supervisor' OR employee_supervisor_purchase.status = 'Approved') AND employee_supervisor_purchase.employeeID = ?
//  ORDER BY employee_supervisor_purchase.id DESC `;

//   const values = [id];
//   db.query(sql, values, (error, result) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       res.json(result);
//     };
//   })
// });

// app.get('/get-purchase-notification-employee/:employeeID', (req, res) => {
//   const id = req.params.employeeID;
//   const sql = ` SELECT employees.username,employee_supervisor_purchase.amount,employee_supervisor_purchase.cost_method,employee_supervisor_purchase.expenditure_line,employee_supervisor_purchase.email,employee_supervisor_purchase.status, employee_supervisor_purchase.end_goal,employee_supervisor_purchase.quotation, employee_supervisor_purchase.quotation, employee_supervisor_purchase.priority,employee_supervisor_purchase.date ,employee_supervisor_purchase.date , employee_supervisor_purchase.id
//  FROM employee_supervisor_purchase
//  JOIN employees ON employee_supervisor_purchase.employeeID = employees.id
// WHERE employee_supervisor_purchase.status = 'Pending' AND employee_supervisor_purchase.employeeID = ?
//  ORDER BY employee_supervisor_purchase.id DESC `;

//   const values = [id];
//   db.query(sql, values, (error, result) => {
//     if (error) {
//       console.error("Error: ", error);
//     } else {
//       res.json(result);
//     };
//   })
// });

// app.get('/get-purchase-notification-hr', (req, res) => {
//   const sql = `SELECT employees.username,supervisor_hr_purchase.amount,supervisor_hr_purchase.cost_method,supervisor_hr_purchase.expenditure_line,supervisor_hr_purchase.email,supervisor_hr_purchase.status, supervisor_hr_purchase.end_goal,supervisor_hr_purchase.quotation, supervisor_hr_purchase.quotation, supervisor_hr_purchase.priority,supervisor_hr_purchase.date ,supervisor_hr_purchase.date , supervisor_hr_purchase.id
//   FROM supervisor_hr_purchase
//   JOIN employees ON supervisor_hr_purchase.employeeID = employees.id
//  WHERE supervisor_hr_purchase.status = 'Pending'
//   ORDER BY supervisor_hr_purchase.id DESC;`;
//   db.query(sql, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-approved-purchase-notification-hr', (req, res) => {
//   const sql = `SELECT employees.username,supervisor_hr_purchase.amount,supervisor_hr_purchase.cost_method,supervisor_hr_purchase.expenditure_line,supervisor_hr_purchase.email,supervisor_hr_purchase.status, supervisor_hr_purchase.end_goal,supervisor_hr_purchase.quotation, supervisor_hr_purchase.quotation, supervisor_hr_purchase.priority,supervisor_hr_purchase.date ,supervisor_hr_purchase.date , supervisor_hr_purchase.id
//   FROM supervisor_hr_purchase
//   JOIN employees ON supervisor_hr_purchase.employeeID = employees.id
//  WHERE supervisor_hr_purchase.status = 'Approved'
//   ORDER BY supervisor_hr_purchase.id DESC;`;
//   db.query(sql, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.get('/get-denied-notification-purchase-hr', (req, res) => {
//   const sql = `SELECT employees.username,supervisor_hr_purchase.amount,supervisor_hr_purchase.cost_method,supervisor_hr_purchase.expenditure_line,supervisor_hr_purchase.email,supervisor_hr_purchase.status, supervisor_hr_purchase.end_goal,supervisor_hr_purchase.quotation, supervisor_hr_purchase.quotation, supervisor_hr_purchase.priority,supervisor_hr_purchase.date ,supervisor_hr_purchase.date , supervisor_hr_purchase.id
//   FROM supervisor_hr_purchase
//   JOIN employees ON supervisor_hr_purchase.employeeID = employees.id
//  WHERE supervisor_hr_purchase.status = 'Denied'
//   ORDER BY supervisor_hr_purchase.id DESC;`;
//   db.query(sql, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   })
// });

// app.put('/change-status/:id', (req, res) => {
//   const id = req.params.id;

//   const status = "Approved By Supervisor";

//   const query = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

//   const values = [status, id];

//   db.query(query, values, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   });
// })



// app.post('/add-purchase-supervisor-hr/:supervisorID', async (req, res) => {

//   const getEmployeeID = (employeeName) => {
//     return new Promise((resolve, reject) => {
//       const sql = `SELECT id FROM employees WHERE username = ?`;
//       db.query(sql, [employeeName], (error, result) => {
//         if (error) {
//           console.error(error);
//           reject(error);
//         } else {
//           const employeeID = result.length > 0 ? result[0].id : null;
//           resolve(employeeID);
//         }
//       });
//     });
//   };

//   try {
//     const gotEmployeeName = req.body.username;

//     const employeeID = await getEmployeeID(gotEmployeeName);
//     const status = 'Pending'

//     const supervisorID = req.params.supervisorID;
//     const email = req.body.email;
//     const priority = req.body.priority;
//     const expenditure = req.body.expenditure_line;
//     const amount = req.body.amount;
//     const cost_method = req.body.cost_method;
//     const endGoal = req.body.end_goal;

//     console.log("Email From Front: ", email);

//     const q = "INSERT INTO supervisor_hr_purchase (expenditure_line, amount, cost_method, supervisor, end_goal, status, email, priority, employeeID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)";

//     const values = [
//       expenditure,
//       amount,
//       cost_method,
//       supervisorID,
//       endGoal,
//       status,
//       email,
//       priority,
//       employeeID
//     ];

//     console.log("Values: ", values);

//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//       } else {
//         res.status(200).send("Request successfully inserted");
//       };

//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get('/get-purchase-id', (req, res) => {
//   const q = `SELECT id FROM employee_supervisor_purchase ORDER BY id DESC LIMIT 1;`;
//   db.query(q, (error, data) => {
//     console.log("Data: ", data);
//     data ? res.json(data) : console.error("Error: ", error);
//   })
// });

// app.get('/supplier/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = "SELECT * FROM supplier WHERE id = ?";
//   db.query(sql, [id], (error, data) => {
//     data ? res.json(data) : console.error("Error: ", error);
//   });
// });

// app.put('/approve-by-hr-purchase/:id', (req, res) => {

//   const id = req.params.id;
//   const status = "Approved";
//   const values = [status, id];
//   const query = `UPDATE employee_supervisor_purchase SET status = ? WHERE id = ?`;

//   db.query(query, values, (error, result) => {
//     result ? res.json(result) : console.error("Error: ", error);
//   });
// });

// app.put('/deny-by-hr-purchase/:id', (req, res) => {
//   const id = req.params.id;
//   const query = `UPDATE supervisor_hr_purchase SET status = 'Denied' WHERE id = ?`;
//   db.query(query, [id], (error, result) => {
//     result ? console.log("Updated Well") : console.error("Error: ", error);
//   });
// });

// const ssh = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCxKBPLSQ1E9SJG7podhvZjH3dP34GXWA5jW0i1jClVsSjN9BrByfKUeiq6E1KsdpXLmxXhMsrlNRugCKSnBfkIaDeobFackhkCv3v9O6KH6lPTHBbWMTT6Ah/5/8RQw5Xk4MOqmhvL6u0H8fJcDg7w3fRB/igSC1Irxe1DDjy/dCwMeAW8OJu4530FdIJ79F/7xWiEvlzx+bRbyaR8AwpBXZBQ/Wfox2frUxevW6ZXOYPu5eaT+UhMC5x4z+7HFl28d/OdDOfQLjgp1mghla/gHBr414qMKqlCWyyDIxpYNe4FjQVac7UUtRTP20ZIF/FL31GDGZOZ21j3yA34tib+yawIfrZa7f66Z1M/HiiPJcGGqoKJz5nddvIOl3F8An+ZyKJ3A2BcE8VnfowJ77WH3X3GN1vg6BpCpUkT/xzJge+U1wcK5bREDjpYeU1l5eo2eiHckjLh0W/jgU0YtGmVAnLBj/v/gxtVwMlnEZ22NrWODhCQDw+G2/xD0BF5Trs= cnziza@centrika-test02`

// app.listen(5500, () => {
//   console.log("Connected to backend")
// })
import React from 'react';

function Delivery( CompanyName, itemName, amount, date ) {

    return `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0%;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0 auto;
            max-width: 800px;
            padding: 20px;
        }

        .title {
            text-align: center;
        }

        .letterhead {
            /* margin-bottom: 20px; */
            /* padding-bottom: 10px; */
            display: flex;
            width: 100%;
            height: 23%;
            gap: 12px;
            /* justify-content: flex-end; */
            /* padding: 20px; */
        }

        .address {}

        .contact-info {
            font-size: 0.9rem;
            margin-bottom: 10px;
        }

        .delivery-note {
            text-decoration: underline;
            font-weight: bold;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="letterhead">
        <div style="width: 40%; height: 40%; ">
            <img src="https://firebasestorage.googleapis.com/v0/b/inventoryquotation.appspot.com/o/Centrikalogo%2Fcentrika-removebg.png?alt=media&token=cfce643f-ba97-4fc8-8a05-8571d0a9ce79" alt="centrika-removebg"
                style="width: 200px; height: 130px;" />
        </div>
        <div style="margin-right: 30px; display: flex; ">
            <p class="title">2nd Floor CHIC Building</p>
        </div>

        <div class="address">
            <p>P.O. Box: 4097 Kigali-Rwanda</p>
            <p>KN 2, Nyarugenge Kigali-Rwanda</p>
            <p>Tel: +250 731 000 100</p>
            <p>Email: info@centrika.rw</p>
            <p>Website: <a href="http://www.centrika.rw">www.centrika.rw</a></p>
        </div>


    </div>
    <div style="margin-top: 90px;">
        <p>Date, ${date}</p>
        <p>Att: ${CompanyName}</p>
    </div>

    <div style="margin-top: 90px;">
        <p class="delivery-note">Delivery Note</p>
    </div>
<div style="margin-top: 70px;">
    <p>The following ${itemName}: ${amount} have been delivered in good conditions with full configuration of <strong>Electronic
            Fare Collection System of "${CompanyName}"</strong></p>
</div>
    <div style="width: 60%; margin-top: 70px;">
        <table>
            <thead>
                <tr>
                    <th>Item#</th>
                    <th>Serial Number</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td>N860WB9751</td>
                </tr>
                <tr>
                    <td></td>
                    <td>N860WB9751</td>
                </tr>
                <tr>
                    <td></td>
                    <td>N860WB9751</td>
                </tr>
                <tr>
                    <td></td>
                    <td>N860WB9751</td>
                </tr>
                <tr>
                    <td></td>
                    <td>N860WB9751</td>
                </tr>
                <tr>
                    <td></td>
                    <td>N860WB9751</td>
                </tr>
            </tbody>
        </table>
    </div>

    <table>
        <tbody>
            <tr>
                <th colspan="3" class="title">Sender / Centrika</th>
            </tr>
            <tr>
                <td>Names:</td>
                <td>Signature: <br>
                    Date, ${date}</td>
                <td>Stamp</td>
            </tr>
        </tbody>
    </table><br>

    <table>
        <tbody>
            <tr>
                <th colspan="3" class="title">Receiver / ${CompanyName}</th>
            </tr>
            <tr>
                <td>Names:</td>
                <td>Date, ${date}</td>
                <td>Stamp</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
  `;
}

export default Delivery;

module.exports = (data) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>Здравствуйте, ${data.userName}</h1>
              </div>
              <div class="email-body">
                <p><a href="https://instagram.lern.dev/api/v1/confirm?tkey=${data.token}">Для завершения регистрации, пожалуйста пройдите по ссылке</a></p>
              </div>
              <div class="email-footer">
                <p>Copyright © 2006–2023 ООО "Instagram Украина", 0-800-307-307</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
}
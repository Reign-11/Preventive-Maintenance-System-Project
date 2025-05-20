<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Create Word File in Laravel</title>
    <link rel="stylesheet" href="asset('css/app.css')">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">  
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"></script>  
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>  
  </head>
  <body>
    <div class="container">
      <h2>Create Word File in Laravel</h2><br/>
      <form method="post" action="url('store')">
        @csrf
        <div class="row">
          <div class="col-md-4"></div>
          <div class="form-group col-md-4">
            <label for="Name">Name:</label>
            <input type="text" class="form-control" name="name">
          </div>
        </div>
        <div class="row">
          <div class="col-md-4"></div>
            <div class="form-group col-md-4">
              <label for="Email">Email:</label>
              <input type="text" class="form-control" name="email">
            </div>
          </div>
        <div class="row">
          <div class="col-md-4"></div>
            <div class="form-group col-md-4">
              <label for="Number">Phone Number:</label>
              <input type="text" class="form-control" name="number">
            </div>
          </div>
        <div class="row">
          <div class="col-md-4"></div>
          <div class="form-group col-md-4">
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
        </div>
      </form>
   </div>
  </body>
</html>

<!-- <!DOCTYPE html>
<html>
<head>
    <title>Print Document</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { text-align: center; margin-bottom: 20px; }
        p { font-size: 16px; }
    </style>
    <script>
        window.onload = function() {
            window.print();  // Automatically trigger print dialog
        }
    </script>
</head>
<body>
    <h1>Hello from Laravel!</h1>
    <p>This document was generated as a PDF and can now be printed directly from the browser.</p>
</body>
</html> -->

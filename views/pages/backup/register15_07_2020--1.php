<%- include('../template/head')-%>
<html>
<link href="//cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css" rel="stylesheet">
<body class="text-center">
<div class="alert-danger", role="alert", id="error-group", style="display: none"></div>
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <%- include('../template/nav')-%>
     
       <div class="row">

            <div class="col-6">

            <div class="error1">
<% if (locals.errors) { %>
    <ul>
        <% Object.values(errors).forEach(function(error){ %>
              <li><%= error.msg %></li>
        <% }); %>
    </ul>
    <% } %>
</div>


             <div class="card1">

            <div class="card-body">
            <h1>Registration</h1></br>  
                <form method="post"  action="/register" id="formadd1" method="post" class="mt-2" enctype="multipart/form-data">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                        <label for="pwd" class="label">Name</label>
                                        <input type="text"  name="name1" id="name" class="form-control" placeholder="Please enter the name" >
                                        <label id="name-error" style="color:red" class="error" for="name"></label>
                                </div>
                            </div>
                          
                               <div class="col-sm-6">
                                   <div class="form-group">
                                        <label for="pwd">E-mail</label>
                                        <input type="text"  name="email" id="email" class="form-control" placeholder="Please enter the email" >
                                    </div>
                                </div>
                            
                               <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="pwd">Password</label>
                                        <input type="password"  name="password" id="password" class="form-control" placeholder="Please enter the password">
                                    </div>
                                </div>
                           
                                <div class="col-sm-6">
                                    <div class="form-group ">
                                        <label for="pwd">Phone Number</label>
                                        <input type="text"  name="phone" id="phone" class="form-control" placeholder="Please enter the phone no" >
                                    </div>
                                </div></br></br></br>
                                
                            </div> </br>
                           
                            <div class="box-footer">
                               <div class="pull-right paddA10">
                                   <input type="submit" class="btn btn-danger btn-block" value="save" />
                                </div>
                           </div>
                </form>
                </div>
            </div>
        </div>
    </div>
</div> </br></br>
            <table class="table table-striped table-hover table-bordered"       >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone No</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>  
    </body>
</html>

<script type="text/javascript" src="
http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.2/jquery.validate.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js"></script>
<script>

$(document).ready( function () {
    $('#myTable').DataTable();
});

 
  
</script>

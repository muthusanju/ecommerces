<%- include('../template/head')-%>
<html>
<body class="text-center">
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <%- include('../template/nav')-%>

                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 paddlr">
                        <form id="formadd1" method="post" class="ptt10" enctype="multipart/form-data">
                            <div class="row">
                                <div class="form-group col-md-8">
                                        <label for="pwd">Name</label>
                                        <input type="text"  name="name" id="name" class="form-control" >
                                        <span id="name_error" class="text-danger"></span>
                                </div>
                                  <div class="form-group col-md-8">
                                        <label for="pwd">E-mail</label>
                                        <input type="text"  name="email" id="email" class="form-control" >
                                        <span id="email_error" class="text-danger"></span>
                                </div>
                                <div class="form-group col-md-8">
                                        <label for="pwd">Phone Number</label>
                                        <input type="text"  name="phone" id="phone" class="form-control" >
                                        <span id="phone_error" class="text-danger"></span>
                                </div>
                              
                            </div>  
                            <div class="col-sm-1">
                                <div class="form-group"> 
                                   <input type="submit" class="btn btn-info pull-right" value="save" />
                                </div>
                            </div>
                </form>
                </div>
            <div > 
    </div>
</body>
</html>

<script type="text/javascript" src="
http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.2/jquery.validate.min.js"></script>

<script type="text/javascript">

 $("form[id='formadd1']").validate({         
        rules: {
          name: "required",          
          email: "required", 
          phone: "required", 
        },
        messages: {
          name : "Please enter the name",                   
          email: "Please enter the email",   
          phone: "Please enter the phone number"
        },
        submitHandler: function(form) {
            
          form.submit();
        }
    });
</script>

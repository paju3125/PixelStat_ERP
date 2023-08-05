(function() {
    "use strict";

    $('body').append('<div class="spinner-container" id="loadingDiv"><div class="spinnerWrap"><div class="spinner" id="spinner1"></div></div>');
    $(window).on('load', function() {
        setTimeout(removeLoader, 0);
    });

    function removeLoader() {
        $("#loadingDiv").fadeOut(250, function() {
            $("#loadingDiv").remove();
        });
    }

    $('#login-form .login_btn').click(function(e) {
        e.preventDefault()
        var response = grecaptcha.getResponse();
        if (response.length == 0) {
            alert('Verify reCaptcha')
        } else {
            let loginData = [
                { username: document.forms['login-form']['username'].value },
                { password: document.forms['login-form']['password'].value }
            ]
            var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (loginData[0]['username'] == '' || loginData[1]['password'] == '') {
                alert('Enter username and password')
                document.forms['login-form']['username'].focus()
            } else if (re.test(loginData[1]['password']) == false) {
                alert('Please match the pattern')
                document.forms['login-form']['password'].focus()
            } else {
                $('#login-section').prepend('<div class="alert alert-success alert-dismissible fade show text-center" role="alert" id="alert"><strong>Verifying credientials... Please wait<strong><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                $('body').append('<div class="spinner-container" id="loadingDiv"><div class="spinnerWrap"><div class="spinner" id="spinner1"></div></div>');

                $.ajax({
                    type: "POST",
                    url: "/verifyAdmin",
                    data: JSON.stringify(loginData),
                    contentType: "application/json",
                    dataType: 'json',
                    success: function(login) {
                        removeLoader();
                        if (login['status']) {
                            if (login['user'] == 'admin') {
                                let loggeduser = {
                                    'user': login['user'],
                                    'username': login['username']
                                }
                                document.cookie = "loggeduser=" + JSON.stringify(loggeduser)
                                $('#login-section').remove('.alert')
                                window.location.href = ('admin')
                            } else if (login['user'] == 'manager') {
                                let loggeduser = {
                                    'user': login['user'],
                                    'username': login['username']
                                }
                                document.cookie = "loggeduser=" + JSON.stringify(loggeduser)
                                $('#login-section').remove('.alert')
                                window.location.href = ('manager')
                                    // $('#login-section .alert').removeClass('alert-danger');
                                    // $('#login-section .alert').addClass('alert-success');
                                    // $('#login-section .alert strong').text('Verified... OTP sent on your email ID.')
                                    // $('#login-section .login').addClass('d-none')
                                    // $('#login-section .otp').removeClass('d-none')

                                // $('#login-section .otp .validate').click(function() {
                                //     const inputs = document.querySelectorAll('#otp > *[id]');
                                //     let otp = ''
                                //     inputs.forEach(input => {
                                //         otp += input.value
                                //     });
                                //     if (otp == login['otp']) {
                                //         let loggeduser = {
                                //             'user': login['user'],
                                //             'username': login['username']
                                //         }
                                //         document.cookie = "loggeduser=" + JSON.stringify(loggeduser)
                                //         $('#login-section').remove('.alert')
                                //         window.location.href = ('manager')
                                //     } else {
                                //         $('#login-section .alert').removeClass('alert-success');
                                //         $('#login-section .alert').addClass('alert-danger');
                                //         $('#login-section .alert strong').text('Invalid OTP')
                                //         inputs[5].focus()
                                //     }
                                // })
                            }
                        } else {
                            $('#login-section .alert').removeClass('alert-success');
                            $('#login-section .alert').addClass('alert-danger');
                            $('#login-section .alert strong').text('Invalid username or password!')
                            document.forms['login-form']['username'].focus()
                        }
                    }
                });
            }
        }
    })

    // $('#otp-form .back-to-login').click(function(e) {
    //     e.preventDefault()
    //     $('#login-section .login').removeClass('d-none')
    //     $('#login-section .otp').addClass('d-none')
    // })

})()

document.addEventListener("DOMContentLoaded", function(event) {

    function OTPInput() {
        const inputs = document.querySelectorAll('#otp > *[id]');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('keydown', function(event) {
                if (event.key === "Backspace") { inputs[i].value = ''; if (i !== 0) inputs[i - 1].focus(); } else {
                    if (i === inputs.length - 1 && inputs[i].value !== '') { return true; } else if (event.keyCode > 47 && event.keyCode < 58) {
                        inputs[i].value = event.key;
                        if (i !== inputs.length - 1) inputs[i + 1].focus();
                        event.preventDefault();
                    } else if (event.keyCode > 64 && event.keyCode < 91) {
                        inputs[i].value = String.fromCharCode(event.keyCode);
                        if (i !== inputs.length - 1) inputs[i + 1].focus();
                        event.preventDefault();
                    }
                }
            });
        }
    }
    OTPInput();


});
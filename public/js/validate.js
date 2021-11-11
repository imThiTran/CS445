
function Validator(options){

    var selectorRules = {};

    function validate(inputElement, rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelect);
        var errorMess;

        var rules = selectorRules[rule.selector];

        for(var i = 0; i < rules.length; ++i){
            errorMess = rules[i](inputElement.value);
            if(errorMess) break;
        }

        if(errorMess){
            errorElement.innerText = errorMess;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMess;
    }

    var formElement = document.querySelector(options.form);

    if(formElement){
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);
            var isValid  = validate(inputElement, rule);
            if(!isValid){
                isFormValid = false;
            }
            });            
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                        return (values[input.name]=input.value) && values
                    },{})
                    options.onSubmit(formValues)
                }else formElement.submit()
            } 
        }

        options.rules.forEach(function(rule){

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
           
            if(inputElement){
                inputElement.onblur = function(){
                   validate(inputElement, rule);
                }

                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelect);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    };
}

Validator.isName = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >=5 ? undefined : message || 'Họ tên phải có độ dài hơn 5 ký tự';
        }
    };
}


Validator.isEmail = function(selector, message){
     return {
        selector: selector,
        test: function(value){
            var regax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regax.test(value) ? undefined : message || 'Vui lòng nhập đúng định dạng email';
        }
    };
}

Validator.isPhone = function(selector, message){
    return {
       selector: selector,
       test: function(value){
           var regax = /^(84|0[3|5|7|8|9])+[0-9]{8}$/;
           return regax.test(value) ? undefined : 'Vui lòng nhập đúng số điện thoại';
       }
   };
}


Validator.minLength = function(selector, message){
    return {
       selector: selector,
       test: function(value){
           return value.length >=8 ? undefined : 'Vui lòng nhập tối thiểu 8 ký tự';
       }
   };
}

Validator.isConfirm = function(selector, getConfirm, message){
    return {
       selector: selector,
       test: function(value){
           return value == getConfirm() ? undefined :'Mật khẩu không trùng khớp';
       }
   };
}

Validator.isNotConfirm = function(selector, getConfirm, message){
    return {
       selector: selector,
       test: function(value){
           return value != getConfirm() ? undefined :'Mật khẩu mới không được trùng với mật khẩu cũ';
       }
   };
}

Validator.isAddress = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >=5 ? undefined : message || 'Mời bạn nhập địa chỉ thực tế';
        }
    };
}

Validator.isWard = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    };
}





function showError(key, mess){
    document.getElementById(key + '_error').innerHTML = mess;
}

function validate()
{
    var flag = true;

    var timefrom = document.getElementById('time-from').value;
    if (timefrom == ''){
        showError('timefrom', 'Vui lòng chọn ngày');
        flag = false;
    }
   
    else{
        showError('timefrom','');
        flag = true;
    }

    var timeto = document.getElementById('time-to').value;
    if (timeto == ''){
        showError('timeto', 'Vui lòng chọn ngày');
        flag = false;
    }
   
    else{
        showError('timeto','');
        flag = true;
    }
}



//     var password = document.getElementById('pass').value;

//     if (password == '' ){
//         showError('pass', 'Vui lòng không để trống mật khẩu');
//         flag = false;

//     }
//     else if (password.length < 8){
//         showError('pass', 'Độ dài phải lớn hơn 8 ký tự');
//         flag = false;

//     }
//     else{
//         showError('pass','');
//         flag = true;
//     }


//     var repassword = document.getElementById('repass').value;
//     if (repassword == '' ){
//         showError('repass', 'Vui lòng không để trống mật khẩu');
//         flag = false;

//     }
//     else if (password != repassword){
//         showError('repass', 'Mật khẩu không trùng khớp');
//         flag = false;
//     }
//     else{
//         showError('repass','');
//         flag = true;
//     }


//     var phone = document.getElementById('phone').value;
//     var phoneformat = /^(84|0[3|5|7|8|9])+[0-9]{8}$/;
//     if (phone == ''){
//         showError('phone', 'Vui lòng không để trống số điện thoại');
//         flag = false;
//     }
//     else if ( !phoneformat.test(phone)){
//         showError('phone', 'Vui lòng nhập đúng số điện thoại');
//         flag = false;
//     }
//     else{
//         showError('phone','');
//         flag = true;
//     }


//     var email = document.getElementById('email').value;
//     var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     if (email == ''){

//         showError('email', 'Vui lòng không để trống email');
//         flag = false;

//     }
//     else if (!mailformat.test(email)){

//         showError('email', 'Sai định dạng email');
//         flag = false;

//     }
//     else{
//         showError('email', '');
//         flag = true;
//     }


//     var birth = document.getElementById('birth').value;
//     if(birth == ''){
//         showError('birth','Vui lòng chọn ngày sinh');
//         flag = false;
//     }
//     else{
//         showError('birth','');
//         flag = true;
//     }

//     return flag;
// } 
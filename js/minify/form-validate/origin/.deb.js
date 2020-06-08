/*
Theme Name: Default
Theme URI: {URL_NULL}
Author: Bruno Moura
Author URI: {URL_NULL}/
Description: MVC - Default
Version: 20170404
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: site

This theme, like Default, is licensed under the GPL.
Use it to make something cool, have fun, and share what you've learned with others.
*/

/*
 *@function extend fn
 *@method formValidate
 *@description carrega todas funções e métodos
 *@object param(null)
 *@author Bruno Moura
 *@version 1.0
*/
fn.validate = function(){
	formValidate.init();
}

function FormValidate(){
	var thisClass = this;
	this.init = function(){
		thisClass.validate();
	};

	this.validate = function(){
		$('#form-send').validate({
			submitHandler: function(form){
				$(form).ajaxSubmit({
					dataType: 'json',
			        beforeSubmit: function(data, form, status){
			        },
			        success: function(data,status,xhr,form){
			        	if(data.status = 'success'){
			        		window.location = data.url;
			        	} else {
			        		$('.box-form').html(data.text);
			        	}
			        },
			        error: function(){
			        	
			        }
				});
			},
			invalidHandler: function(data, data){
			},
			highlight: function(element, errorClass){
			},
			unhighlight: function(element, errorClass){
			}
		});
	};
}
var formValidate = new FormValidate();
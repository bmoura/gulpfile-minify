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
 *@method formCustom
 *@description carrega todas funções e métodos
 *@object param(null)
 *@author Bruno Moura
 *@version 1.0
*/
fn.formCustom = function(){
	formCustom.init();
}

function FormCustom(){
	var thisClass = this;
	this.init = function(){
		thisClass.translateValidatePT_BR();
		thisClass.customValidate();
		thisClass.maskForm();
		thisClass.cidadeEstado();
		thisClass.boxEvent({
			object: $('input[data-target-open]'),
			addClass: 'open',
			removeClass: 'close'
		});
		thisClass.boxEvent({
			object: $('input[data-target-close]'),
			addClass: 'close',
			removeClass: 'open'
		});
	};

	this.boxEvent = function(data){
		data.object.click(function(event){
			var _this = $(this),
				_target = $('[data-target="' + $(this).data('target-event') + '"]');
			_target.removeClass(data.removeClass).addClass(data.addClass);
		});
	};

	this.translateValidatePT_BR = function(){
		$.extend($.validator.messages, {
			required: "N&atilde;o pode ficar em branco",
			remote: "Por favor, corrija este campo",
			email: "Preencha com um e-mail v&aacute;lido",
			url: "O campo deve ser uma url v&aacute;lida",
			complete_url: "O campo deve ser uma url v&aacute;lida",
			date: "O campo deve ser uma data v&aacute;lida",
			datePT: "O campo deve ser uma data v&aacute;lida",
			dateISO: "O campo deve ser uma data v&aacute;lida (ISO)",
			number: "O campo deve ser um n&uacute;mero v&aacute;lido",
			digits: "O campo deve ser somente d&iacute;gitos",
			creditcard: "O campo deve ser um cart&atilde;o de cr&eacute;dito v&aacute;lido",
			equalTo: "Confirma&ccedil;&atilde;o est&aacute; diferente",
			accept: "O campo Por favor, forne&ccedil;a um arquivo com uma extens&atilde;o v&aacute;lida",
			maxlength: $.validator.format("O campo deve ser menor ou igual a {0}"),
			minlength: $.validator.format("O campo deve ser maior ou igual a {0}"),
			rangelength: $.validator.format("O campo deve ter entre {0} e {1} caracteres"),
			range: $.validator.format("Use um valor entre {0} e {1}"),
			max: $.format("O campo deve ser menor do que {0}"),
			min: $.format("O campo deve ser maior do que {0}"),
			maxValue: $.format("O campo deve ser menor ou igual a {0}"),
			minValue: $.format("O campo deve ser maior ou igual a {0}")
		});
	};

	this.maskForm = function(){
		$('#field-cpf').mask("999.999.999-99",{
			// placeholder:"000.000.000-00",
			onComplete:function(val, event, el, opt){
				thisClass.maskNextElement(el);
			}
		});

		$('#field-numero').mask("999999",{
			// placeholder:"00",
			onComplete:function(val, event, el, opt){
				thisClass.maskNextElement(el);
			}
		});

		var celular = function(type){
			return '(00)00000-0000';
		}
		$('#field-telefone').mask(celular,{
			// placeholder:"(DDD)0000-0000",
			onKeyPress: function(val, event, el, opt){
				$(el).mask(celular(val), opt);
			},
			onComplete:function(val, event, el, opt){
				thisClass.maskNextElement(el);
			}
		});

		$('#field-cep').mask("99999-999",{
			// placeholder:"00000-000",
			onComplete:function(val, event, el, opt){
				var _p = el.parent();
				$('.load-input').remove();
				_p.append('<span class="load-input cep">Buscando cep...</span>');
				$.getJSON(
					'https://viacep.com.br/ws/'+val+'/json/',
					function(data){
						if(data.erro){
							$('.load-input').addClass('error').html('cep não encontrado');
							$('#field-logradouro').val('');
							$('#field-complemento').val('');
							$('#field-bairro').val('');
							$('#field-estado').val('').change();
							$('#field-cidade').val('').change();
							$('.busca-loja').html('');
							$('.dealership-error ~ label.error').remove();
							$('input[name="dealership_ids[]"]').rules( "remove" );
						} else {
							var _endereco = data.logradouro,
								_complemento = data.complemento,
								_bairro = data.bairro,
								_estado = data.uf,
								_cidade = data.localidade;
							$('#field-logradouro').val(_endereco);
							$('#field-complemento').val(_complemento);
							$('#field-bairro').val(_bairro);
							$('#field-estado').val(_estado.toUpperCase()).change();
							$('#field-cidade').val(_cidade.toUpperCase()).change();
							$('.load-input.cep').remove();
							$('#field-numero').focus();
							proposta.buscaLoja(val, _endereco, _bairro, _cidade, _estado);
						}
				}).fail(function(){
					$('.load-input').addClass('error').html('erro ao pesquisar o cep');
				});
			},
			onKeyPress: function(val, event, el, opt){
				if(val.length < 9){
					if(objectExist($('.load-input.cep'))){
						$('.load-input.cep').remove();
					}
				}
			}
		}).blur(function(event){
			if(objectExist($('.load-input.cep'))){
				$('.load-input.cep').remove();
			}
		});
	};

	this.maskNextElement = function(el){
		var _ip = $('input'), 
			_i = parseInt(_ip.index(el)) + 1;
		_ip.eq(_i).focus();
	};

	this.customValidate = function(){
		$.validator.addMethod("cnpj", function (cnpj, element) {
		    cnpj = $.trim(cnpj);

		    // DEIXA APENAS OS NÚMEROS
		    cnpj = cnpj.replace('/', '');
		    cnpj = cnpj.replace('.', '');
		    cnpj = cnpj.replace('.', '');
		    cnpj = cnpj.replace('-', '');

		    var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
		    digitos_iguais = 1;

		    if (cnpj.length < 14 && cnpj.length < 15) {
		        return this.optional(element) || false;
		    }
		    for (i = 0; i < cnpj.length - 1; i++) {
		        if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
		            digitos_iguais = 0;
		            break;
		        }
		    }

		    if (!digitos_iguais) {
		        tamanho = cnpj.length - 2
		        numeros = cnpj.substring(0, tamanho);
		        digitos = cnpj.substring(tamanho);
		        soma = 0;
		        pos = tamanho - 7;

		        for (i = tamanho; i >= 1; i--) {
		            soma += numeros.charAt(tamanho - i) * pos--;
		            if (pos < 2) {
		                pos = 9;
		            }
		        }
		        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		        if (resultado != digitos.charAt(0)) {
		            return this.optional(element) || false;
		        }
		        tamanho = tamanho + 1;
		        numeros = cnpj.substring(0, tamanho);
		        soma = 0;
		        pos = tamanho - 7;
		        for (i = tamanho; i >= 1; i--) {
		            soma += numeros.charAt(tamanho - i) * pos--;
		            if (pos < 2) {
		                pos = 9;
		            }
		        }
		        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		        if (resultado != digitos.charAt(1)) {
		            return this.optional(element) || false;
		        }
		        return this.optional(element) || true;
		    } else {
		        return this.optional(element) || false;
		    }
		}, "Informe um CNPJ válido.");

		$.validator.addMethod("cpf", function (value, element) {
		    value = $.trim(value);

		    value = value.replace('.', '');
		    value = value.replace('.', '');
		    cpf = value.replace('-', '');
		    while (cpf.length < 11) cpf = "0" + cpf;
		    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
		    var a = [];
		    var b = new Number;
		    var c = 11;
		    for (i = 0; i < 11; i++) {
		        a[i] = cpf.charAt(i);
		        if (i < 9) b += (a[i] * --c);
		    }
		    if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
		    b = 0;
		    c = 11;
		    for (y = 0; y < 10; y++) b += (a[y] * c--);
		    if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }
		    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) return this.optional(element) || false;
		    return this.optional(element) || true;
		}, "Informe um CPF válido."); // Mensagem padrão 

		$.validator.addMethod("dateBR", function (value, element) {
		    //contando chars    
		    if (value.length != 10) return (this.optional(element) || false);
		    // verificando data
		    var data = value;
		    var dia = data.substr(0, 2);
		    var barra1 = data.substr(2, 1);
		    var mes = data.substr(3, 2);
		    var barra2 = data.substr(5, 1);
		    var ano = data.substr(6, 4);
		    if (data.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) return (this.optional(element) || false);
		    if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return (this.optional(element) || false);
		    if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) return (this.optional(element) || false);
		    if (ano < 1900) return (this.optional(element) || false);
		    return (this.optional(element) || true);
		}, "Informe uma data válida");  // Mensagem padrão 

		$.validator.addMethod("datetimeBR", function (value, element) {
		    //contando chars
		    if (value.length != 16) return (this.optional(element) || false);
		    // dividindo data e hora
		    if (value.substr(10, 1) != ' ') return (this.optional(element) || false); // verificando se há espaço
		    var arrOpcoes = value.split(' ');
		    if (arrOpcoes.length != 2) return (this.optional(element) || false); // verificando a divisão de data e hora
		    // verificando data
		    var data = arrOpcoes[0];
		    var dia = data.substr(0, 2);
		    var barra1 = data.substr(2, 1);
		    var mes = data.substr(3, 2);
		    var barra2 = data.substr(5, 1);
		    var ano = data.substr(6, 4);
		    if (data.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) return (this.optional(element) || false);
		    if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return (this.optional(element) || false);
		    if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) return (this.optional(element) || false);
		    // verificando hora
		    var horario = arrOpcoes[1];
		    var hora = horario.substr(0, 2);
		    var doispontos = horario.substr(2, 1);
		    var minuto = horario.substr(3, 2);
		    if (horario.length != 5 || isNaN(hora) || isNaN(minuto) || hora > 23 || minuto > 59 || doispontos != ":") return (this.optional(element) || false);
		    return this.optional(element) || true;
		}, "Informe uma data e uma hora válida");
		
		$.validator.addMethod("timerbr", function (value, element) {
		    if (value.length != 8) return false;
		      var data = value;
				  var hor = data.substr(0, 2);
				  var se1 = data.substr(2, 1);
				  var min = data.substr(3, 2);
				  var se2 = data.substr(5, 1);
				  var seg = data.substr(6, 2);
		      if (data.length != 8 || se1 != ':' || se2 != ':' || isNaN(hor) || isNaN(min) || isNaN(seg)){
		        return false;
		      }
		      if (!((hor>=0 && hor<=23) && (min>=0 && min<=59) && (seg>=0 && seg<=59))){
		        return false;
		      }
		      return true;
		}, "Informe um timer válido.");

		$.validator.addMethod("telefone", function (value, element) {
		    value = value.replace("(","");
		    value = value.replace(")", "");
		    value = value.replace("-", "");
		    value = value.replace(" ", "").trim();
		    return this.optional(element) || /[0-9]{10}/.test(value);
		}, "Informe um telefone válido.");

		$.validator.addMethod('celular', function (value, element) {
			value = value.replace("(","");
		    value = value.replace(")", "");
		    value = value.replace("-", "");
		    value = value.replace(" ", "").trim();

		    var num = /11/g.test(value) ? 11 : 10;

		    if(num == 11){
			    return (this.optional(element) || /[0-9]{11}/.test(value));
		    } else if(num == 10){
			    return (this.optional(element) || /[0-9]{10}/.test(value));
		    }

		    return (this.optional(element) || true);

		}, 'Informe um celular válido'); 
	};

	this.cidadeEstado = function(){
		$.getJSON(URI_ASSETS+'/js/lib/estados-cidades.json', function (data) {
			var items = [];
			var options = '<option value="">Selecione o Estado</option>';	
			$.each(data, function (key, val) {
				options += '<option value="' + val.sigla.toUpperCase() + '">' + val.nome + '</option>';
			});					
			$("#field-estado").html(options);				
			
			$("#field-estado").change(function () {				
			
				var options_cidades = '';
				var str = "";
				var options_cidades = '<option value="">Selecione a Cidade</option>';	
				
				$("#field-estado option:selected").each(function () {
					str += $(this).text();
				});
				
				$.each(data, function (key, val) {
					if(val.nome == str) {							
						$.each(val.cidades, function (key_city, val_city) {
							options_cidades += '<option value="' + val_city.toUpperCase() + '">' + val_city + '</option>';
						});							
					}
				});
				$("#field-cidade").html(options_cidades);
			});
		});
	}
}
var formCustom = new FormCustom();
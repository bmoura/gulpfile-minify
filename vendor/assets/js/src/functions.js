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
 * Carrega depois da indexação da página
 */
$(window).ready(function(){
	if($(window).width() <= 768){
		isMobileTablet = true;
	}

	if($(window).width() <= 768 && $(window).width() >= 737){
		isTablet = true;
	}
	
	if($(window).width() <= 736){
		mobile.init();
	}

	//Chama as funções instanciadas via polimorfismo
	polimorfismo.init(fn);
});

/*
 *@function objectExist
 *@method null
 *@description Verifica se o objeto html existe
 *@object param(object "id ou class")
 *@author Bruno Moura
 *@version 1.0
*/
function objectExist(obj){
	return obj.length > 0 ? true : null;
}

/*
 *@function Polimorfismo
 *@method null
 *@description Carrega as funções instanciadas por classes
 *@object param(null)
 *@author Bruno Moura
 *@version 1.0
*/
function Polimorfismo(){
	this.init = function(p){
		for(v in p){
			if($.isFunction(p[v])){
				p[v]();
			}
		}
	}
}
var polimorfismo = new Polimorfismo();

/*
 *@function Tag
 *@method ga
 *@description Tagueamento
 *@object param{
 				ga: booleano para debugar o ga
 			}
 *@author Bruno Moura
 *@version 1.0
*/
function Tag(){
	this.ga = function(){
		$('body').on('click', '[data-ga-event]', function(){
			var _this = $(this),
				_event = _this.data('ga-event');
			dataLayer.push({'event': _event});
		});
	};
	this.view = function(view){
		dataLayer.push({'event': view});
	}
}
var tag = new Tag();

function formatReal(int){
        var tmp = int+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return 'R$ '+tmp;
}

function getMoney( str )
{
        return parseInt( str.replace(/[\D]+/g,'') );
}

function Versao(){
	var thisClass = this,
		checkRadio = '',
		urlAcessorio = '';
	this.init = function(){
		$('.box-opcionais .opcionais-opt').each(function(i, el) {			
			$(el).click(function(event) {
				var _this = $(this),
					_valor = dataOpcionais.versao[_this.val()].valor,
					_valorTotal = 0;
				checkRadio = '';
				urlAcessorio = '';
				if(_this.val() != 'sem-opcionais' && _this.val() != 'sem-acessorios'){
					$('.opcionais-jow .box-atributos').removeClass('open');
					_this.find('~ .opcionais-jow .box-atributos').addClass('open');
				}
				if(dataOpcionais.opcional.acessorio){
					if(i == 0){
						$('.box-opcionais .opcionais-opt').prop('checked',false);
						_this.prop('checked',true);
					} else if($('.box-opcionais .opcionais-opt:checked').length > 1){
						$('.box-opcionais .opcionais-opt').eq(0).prop('checked',false);
					}
					checkRadio = $('.box-opcionais .opcionais-opt:checked');
					checkRadio.each(function(index, el){
						_valorTotal = _valorTotal + getMoney(dataOpcionais.versao[$(el).val()].somar);
						urlAcessorio = urlAcessorio + (index == 0 ? '' : '|') + $(el).val();
					});
					_valor = formatReal(_valorTotal + getMoney(dataOpcionais.opcional.somar));
					$('.opcionais-item .opcionais-bt').attr({
						href: fn.URL_NAVIGATOR+urlAcessorio
					});
				}
				fn.navTotal.html(_valor);
				$('.cor-carro').hide();
				$('#'+_this.val()).show();
			});
		});
		$('.cor-carro').hide();
		$('.cor-carro').eq(0).show();
		$('.box-opcionais').on('click', '.opcionais-fechar', function(data){
			var _this = $(this),
				_ba =  _this.parents('.box-atributos');
			_ba.removeClass('open');
		});
		if(objectExist($('div.cor-carro'))){
			$('.opcionais-img').html($('.opcionais-img img').eq(0).clone());
		}
	}
}
var versao = new Versao();

function Cor(){
	var thisClass = this;
	this.init = function(){
		var _valor = dataOpcionais.cor.valor_versao,
			_carousel = $('.owl-carousel');
		_carousel.each(function(index, el) {
			var _this = $(this);
			_carouselItens = _this.find('img').clone();
			_this.html(_carouselItens);
			_this.owlCarousel({
				items:1,
				nav: true,
				navText:["‹","›"]
			});

			var _navBox = $('.owl-theme .owl-nav'),
				_dotsBox = $('.owl-theme .owl-dots'),
				_cauc = ((_this.width() - _dotsBox.width())/2);
			_dotsBox.css({
				'margin': '0 '+_cauc+'px'
			});
			_navBox.css({
				'width': _dotsBox.width()+'px',
				'margin': '0 '+_cauc+'px'
			});
		});
		$('.box-opcionais').on('click', '.cor-opt', function(data){
			var _this = $(this),
				_valor = dataOpcionais.cor[_this.val()].valor;
			fn.navTotal.html(_valor);
			$('.cor-carro').hide();
			$('#'+_this.val()).show();
		});
		$('.cor-opt').eq(0).click();
	}
}
var cor = new Cor();

function Menu(){
	var thisClass = this;
	this.init = function(){
		if(dataOpcionais.menu.opcionais){
			$('#menu_opcionais').hide();
		}
		if(dataOpcionais.menu.acessorios){
			$('#menu_acessorios').hide();
		}
	}
}
var menu = new Menu();

function Opcional(){
	var thisClass = this;
	this.init = function(){
		var _valor = dataOpcionais.versao[$('.box-opcionais .opcionais-opt').eq(0).val()].valor;
		fn.navTotal.html(_valor);
	}
}
var opcional = new Opcional();

function Proposta(){
	var thisClass = this;
	this.init = function(){
		fn.navTotal.html(dataOpcionais.proposta.valorTotal);
		$('.dados-img').html($('.dados-img img').eq(0).clone());
	};
	this.buscaLoja = function(cep, end, bairro, cidade, uf){
		$.ajax({
			url: URL+THEME+'/'+TEMPLATE+'/buscaloja.php',
			data:{
				CEP: cep, 
				LOGRADOURO: end,
				BAIRRO: bairro,
				CIDADE: cidade,
				UF: uf
			},
			success: function(result){
	        	$('.busca-loja').html(result);
	        	$('input[name="dealership_ids[]"]').rules('add', {
					required: true
				});
	    	},
	    	erro: function(data){

	    	}
	    });
	}
}
var proposta = new Proposta();

function Mobile(){
	var thisClass = this;
	this.init = function(){
		isMobile = true;
		thisClass.resetElements('.linha-xef, .opt-img');
		$('.box-linha').addClass('owl-carousel owl-theme');
		$('.box-linha').owlCarousel({
			items:1,
			stagePadding:10,
			margin:30,
			nav: true,
			dots: true,
			navText:["‹","›"]
		});
	};
	this.resetElements = function(els){
		$(els).remove();
	}
}
var mobile = new Mobile();
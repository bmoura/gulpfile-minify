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

fn.navTotal = $('.navigator-item.total .navigator-txt');

fn.opcionais = function(){
	if(dataOpcionais.versao){
		area.versao();
	}
	if(dataOpcionais.cor){
		area.cor();
	}
	if(dataOpcionais.menu){
		area.menu();
	}
	if(dataOpcionais.opcional){
		area.opcional();
	}
	if(dataOpcionais.proposta){
		area.proposta();
	}
}

function Areas(){
	this.versao = function(){
		versao.init();
	},
	this.cor = function(){
		cor.init();
		
	},
	this.menu = function(){
		menu.init();
		
	},
	this.opcional = function(){
		opcional.init();
		
	}
	this.proposta = function(){
		proposta.init();
	}
}
var area = new Area();
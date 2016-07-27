/*
Script: Booking form script
Author: Smart
Varsion: 1.0
*/

includeScript ('../booking/js/jquery-ui-1.10.3.custom.min.js');
includeScript ('../booking/js/jquery.fancyform.js');
includeScript ('../booking/js/regula.js');

(function($){
	$.fn.bookingForm=function(options){
		return this.each(function(){
			var $this = $(this),
			data = $this.data('bookingForm'),
			object = {
				url: 'booking/booking.php', // php-script url
				sender: '', // sender for header in e-mail
				ownerEmail:'support@template-help.com', // destination e-mail, message will be send on this e-mail
				validate:true, // validate or not
				errorMessageClass:'.error-message', // error-message class
				successMessageClass:'.success-message', // success-message class
				invalidClass:'.invalid', // invalid class
				inputClass: '.tmInput', // input class
				textareaClass: '.tmTextarea', // textarea class
				selectClass: '.tmSelect', // select class
				checkboxClass: '.tmCheckbox', // checkbox class
				radioClass: '.tmRadio', // radiobutton class
				datepickerClass: '.tmDatepicker', // datepicker class
				wrapperClass: '.controlHolder', // wrapper class, all elements will be wrapped in div with this class
				successMessage: "Your order has been sent! We'll be in touch soon!", // success message
				// private fields
				form: null,
				fields: [],
				types: {input: 'input', textarea: 'textarea', select: 'select', checkbox: 'checkbox', radio: 'radio', datepicker: 'datepicker'},
				init: function () {
					object.createCustomFileds();
					object.fillFields();
					(object.validate) && regula.bind();
					object.addListeners();
				},
				createCustomFileds: function (){
					var wrapper = '<div class="'+String(object.wrapperClass).substr(1)+'"></div>';
					object.form = $(object.data[0]);
					object.form
					.find(object.inputClass)
						.wrap(wrapper).end()
					.find(object.textareaClass)
						.wrap(wrapper).end()					
					.find(object.selectClass)
						.wrap(wrapper)
						.each(function (ind, elem) {
							var $elem = $(elem),
								manual = false,
								dClass = String(object.selectClass).substr(1),
								tempClass,
								autocomplete;

							var tempClass = $elem.attr('data-class');
							if (tempClass) dClass=tempClass;
							$elem.hasClass('manual') ? manual=true : dClass+=' auto';
							autocomplete = $elem.hasClass('autocomplete');

							$elem.transformSelect({
								dropDownClass: dClass,
								acceptManualInput : manual,
								useManualInputAsFilter: autocomplete,
								showFirstItemInDrop : false
							})
						})
						.end()

					.find(object.datepickerClass)
						.wrap(wrapper)
						.find('input')
						.datepicker({
					    	showButtonPanel: true
					    }).end().end()

					.find(object.checkboxClass)
						.wrap(wrapper)
						.find("input:checkbox")
							.transformCheckbox({
								base : "class"
							}).end().end()

					.find(object.radioClass)
						.wrap(wrapper)
						.find("input:radio")
							.transformRadio({
							});
				},
				checked: function($obj) {
					return $obj.hasClass('checked');
				},
				// serialize fields of form {name, value, filed}
				fillFields: function (){
					object.form
						// serialize input
						.find(object.inputClass)
							.each(function(ind, el){
								var inp = $(el).find('input');
								object.fields.push({type: object.types.input,
													name: inp.attr('name'),
													value: inp.val(),
													field: inp[0],
													input: inp,
													wrapper: inp.parents(object.wrapperClass)});
							})
						.end()
						// serialize textarea
						.find(object.textareaClass)
							.each(function(ind, el){
								var inp = $(el).find('textarea');
								object.fields.push({type: object.types.textarea,
													name: inp.attr('name'),
													value: inp.val(),
													field: inp[0],
													input: inp,
													wrapper: inp.parents(object.wrapperClass)});
							})
						.end()
						// serialize selects
						.find('select'+object.selectClass)
							.each(function(ind, el){
								var $el = $(el),
									wpr = $el.parents(object.wrapperClass),
									inp = wpr.find('input'),
									ul = wpr.find('input+ul'),
									sel = wpr.find('select');
								if (sel.hasClass('auto')) {
									ul = wpr.find('ul ul')
									inp = sel;
								}
								object.fields.push({type: object.types.select,
													name: inp.attr('name'),
													value: ul.find('.checked').text(),
													field: ul[0],
													input: inp,
													wrapper: wpr});
							})
						.end()
						// serialize checkboxes
						.find(object.checkboxClass)
							.each(function(ind, el){
								var $el = $(el),
								inp = $el.find('input'),
								span = $el.find('span').eq(0);
								object.fields.push({type: object.types.checkbox,
													name: inp.attr('name'),
													value: object.readValueCheckbox(span),
													field: span[0],
													input: inp,
													wrapper: span.parents(object.wrapperClass)});
							})
						.end()
						// serialize radiobuttons
						.find(object.radioClass)
							.each(function(ind, el){
								var $el = $(el),
									inp = $el.find('input').toArray(),
									wpr = $el.parents(object.wrapperClass);
								object.fields.push({type: object.types.radio,
													name: inp[0].name,
													value: object.readValueRadio(wpr),
													field: $el.find('strong').toArray(),
													input: $(inp[0]),
													wrapper: wpr});
							})
						.end()
						// serialize datepickeres
						.find(object.datepickerClass)
							.each(function(ind, el){
								var inp = $(el).find('input');
								object.fields.push({type: object.types.datepicker,
													name: inp.attr('name'),
													value: inp.attr('value'),
													field: inp[0],
													input: inp,
													wrapper: inp.parents(object.wrapperClass)});
							})
						.end()
				},
				readValueCheckbox: function (span){
					return object.checked(span)?'Yes':'No';
				},
				readValueRadio: function(wpr){
					return wpr.find('strong.checked+*').text()
				},
				// read filelds data
				readFieldsData: function (){
					object.fields.forEach(function (el, ind) {
						switch (el.type) {
							case object.types.input: 
								el.value = $(el.field).attr('value');
							break;
							case object.types.textarea: 
								el.value = $(el.field).val();
							break;
							case object.types.select:
								el.value = $(el.field).find('.checked').text();
								var wpr = el.wrapper;
								if (wpr.find('.manual').length) {
									var inp = wpr.find('input');
									wpr.find('.transformSelectDropdown li').each(function (index, elem) {
										(inp.val() === $(elem).text()) && $(elem).trigger('click');
									})
								}
							break;
							case object.types.checkbox:
								el.value = object.readValueCheckbox($(el.field));
							break;
							case object.types.radio:
								el.value= object.readValueRadio(el.wrapper);
							break;
							case object.types.datepicker: 
								el.value = $(el.field).attr('value');
							break;
						}
					})
				},
				// validate data
				validateData: function(){
					var validationResults = regula.validate();
			        object.fields.forEach(function(el, ind){
			        	el.wrapper
			        		.removeClass(className(object.invalidClass))
			        		.find(object.errorMessageClass).remove();
			        })

			        $.each(validationResults, function(i, r) {
						var wpr = $(validationResults[i].failingElements[0]).parents(object.wrapperClass); 
					  	if (!wpr.hasClass(className(object.invalidClass))) {
						  	wpr
							  	.addClass(className(object.invalidClass))
							  	.append('<strong class="'+className(object.errorMessageClass)+'">'+validationResults[i].message+'</strong>')
								.find(object.errorMessageClass)
									.slideUp(0).slideDown();
						}
					});
				},
				// prepare data
				prepareData: function () {
					var data = {
						owner_email: object.ownerEmail,
						sender: (object.sender == '')?location.hostname:object.sender
					}
					object.fields.forEach(function(el, ind){		
						var val = object.fields[ind].value; 
						if (val == '') val = 'nope';
						data[object.fields[ind].name] = val;
					})
					return data;
				},
				// submit data
				submitData: function(){	
					$.ajax({
						type: "POST",
						url: object.url,
						data: object.prepareData(),
						success: function(results){
							$this
								.find(object.successMessageClass).remove().end()
								.find('[data-type="submit"]').after('<p class="'+className(object.successMessageClass)+'">'+ object.successMessage +'</p>')
								.find(object.successMessageClass).stop(true).slideUp(0).slideDown().delay(1000).slideUp();
						}
					})
				},
				// addListebers to controls
				addListeners: function () {
					$('a[data-type="submit"]').click(function(){
						object.readFieldsData();
						object.validateData();
						if (!$this.find(object.invalidClass).length) {
							object.submitData();	
						}
					})
				},
				log: function(){
					object.fields.forEach(function (el) {
						console.log(el.wrapper[0]);
					})
				}
			}
			data ? object=data : $this.data({bookingForm: object});
    		typeof options=='object' && $.extend(object, options);
    		object.data || object.init(object.data = $this);
		})
		return this;
	}
})(jQuery);

// extrude class name
function className(className){
	return String(className).substr(1);
}

function includeScript(url){
	document.write('<script type="text/javascript" src="js/'+ url + '"></script>'); 
	return false;
}
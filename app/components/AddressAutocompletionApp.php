<?php

class AddressAutocompletionApp extends AppWidget {

    public $googleApiKey;
    public $geolocationEnabled =  false;
    public $autocompletionEnabled =  true;

	/**
	 * @var array The input Ids for autocompletion
	 */
	public $inputIds = [];

    public function init() {
        parent::init();
    }

    public function run() {
		$this->registerBaseScript();
		if ($this->geolocationEnabled) {
			$this->registerGeolocationScript();
		}
		if ($this->autocompletionEnabled) {
			$this->registerAutocompletionScript();
		}
    }

	private function minimizeScript($js) {
		return YII_DEBUG ? $js : JSMinPlus::minify($js);
	}

	private function minimizeCss($css) {
		return YII_DEBUG ? $css : CssMin::minify($css);
	}

	private function registerBaseScript() {
		$js = <<<JS

	    function setElementValue(element, val) {
	        switch (element.prop('nodeName').toLowerCase()) {
	            case 'select':
	                element.val(findDropdownValue(element, val));
	                break;
	            default:
	                element.val(val);
	        }
	    }
	
	    function findDropdownValue(element, val) {
	        return element.find('option').filter(function () {
	            return $(this).data('geo-value') === val;
	        }).val();
	    }
	
	
	    function fillInAddress(location) {
	        var addressComponents = {};
	        location.address_components.forEach(function (component) {
	            component.types.forEach(function (type) {
	                addressComponents[type] = {
	                    'long_name': component.long_name,
	                    'short_name': component.short_name
	                };
	            });
	        });
	
	        $('[data-geo-template]').each(function () {
	            var template = $(this).data('geo-template');
	            var separator = $(this).data('geo-separator') || ' ';
	            var nodeName = $(this).prop('nodeName').toLowerCase();
	
	            if (nodeName === 'input') {
	                var values = Object.keys(template).map(function (type) {
	                    var nameType = template[type];
	                    return addressComponents[type] ? addressComponents[type][nameType] : '';
	                });
                    if (true /*values.every(function(currentValue) {return currentValue !== ''})*/) { //if we don't want to clean unknown autocompletion data
	                	$(this).val(values.filter(Boolean).join(separator));
                    }
	            } else if (nodeName === 'select') {
	                var selectType = Object.keys(template)[0];
	                var nameType = template[selectType];
	                var selectValue = addressComponents[selectType] ? addressComponents[selectType][nameType] : '';
                    if (true /*selectValue !== ''*/) { //if we don't want to clean unknown autocompletion data
		                $(this).find('option').filter(function () {
		                    return $(this).data('geo-value') === selectValue;
		                }).prop('selected', true);
                    }
	            }
	        });
	    }
        
        function gm_authFailure() { 
		    alert('Error cargando librería de Google debido a problema de API key incorrecta.');
            //Release the input field to let them manual input
            $('#Order_billing_address_1').prop('disabled', false).css('background-image', '').attr('placeholder', '');
            google.maps.event.removeListener(autocompleteLsr);
			google.maps.event.clearInstanceListeners(autocomplete);
			$(".pac-container").remove();
            $('#get-location-link').removeClass('animated infinite flash').hide();
            
		}
        
JS;
		Yii::app()->clientScript->registerScript(__CLASS__.'#base-js', $this->minimizeScript($js), CClientScript::POS_END);
		Yii::app()->clientScript->registerScriptFile("https://maps.googleapis.com/maps/api/js?key={$this->googleApiKey}&callback=initAutocomplete&libraries=places&v=weekly", CClientScript::POS_END, ['defer' => true, 'async' => true]);

	}


	private function registerAutocompletionScript() {
		$js = <<<JS

		var addressInputField = document.getElementById('Order_billing_address_1');

        var autocomplete, autocompleteLsr;
        
        // Google Places Autocomplete Initialization
	    var initAutocomplete = function() {
	        var countryDropdown = $('#Order_billing_country_id');
	        var selectedCountry = countryDropdown.find('option:selected').data('geo-value');
	        var options = {fields: ['address_components', 'formatted_address'],types: [ "address" ], componentRestrictions: {country: selectedCountry}};
            
            autocomplete = new google.maps.places.Autocomplete(addressInputField, options);
            
	        google.maps.event.addDomListener(addressInputField, 'focus', function (e) {
	            e.target.setAttribute('autocomplete', 'new-password')
	        }); //to avoid browser autofill
	
	        countryDropdown.change(function () {
	            var selectedCountry = $(this).find('option:selected').data('geo-value');
	            autocomplete.setComponentRestrictions({'country': selectedCountry});
	        });
	
	        autocompleteLsr = autocomplete.addListener('place_changed', function () {
	            var place = autocomplete.getPlace();
	            if (place.address_components) {
	                fillInAddress(place);
	            }
	        });
            addressInputField.addEventListener('keydown', function(event){
                if (event.key === 'Enter') {
	            event.preventDefault();
	            event.stopPropagation();
        		}
            });
	    }
JS;


		$css = <<<CSS
	    .pac-item {
	        padding: 5px 10px;
	        color: #898992;
	    }
	
	    .pac-item-query {
	        color: #333;
	    }
	
	    .pac-icon {
	        display: none;
	    }
	
	    .pac-logo:after {
	        filter: grayscale(1) brightness(1) contrast(0.2);
	        opacity: 0.5;
	        border-top: 1px dotted #efefef;
	    }
CSS;

		Yii::app()->clientScript->registerCSS(__CLASS__.'#autocompletion-css', $this->minimizeCss($css));
		Yii::app()->clientScript->registerScript(__CLASS__.'#autocompletion-js', $this->minimizeScript($js), CClientScript::POS_END);

	}

	private function registerGeolocationScript() {
		$js = <<<JS

		if (window.location.protocol === "https:" && navigator.geolocation) {
            $('#get-location-link').show().on('click', function(e) {
                geolocate(this);
            });
        }
        
		var geocodeApiBaseUrl = window.location.protocol + '//maps.googleapis.com/maps/api/geocode/json';

		// Geolocation Function
	    function geolocate(elem) {
	        $(elem).addClass('animated infinite flash');
	        navigator.geolocation.getCurrentPosition(function(position) {
        		var latlng = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
                geocoder = new google.maps.Geocoder();
		        geocoder.geocode({'location': latlng}, function(results, status) {
		            if (status === google.maps.GeocoderStatus.OK) {
		                if (results[0]) {
		                    updateFormFields({results: results});
		                } else {
		                    alert('Error recuperando datos de localización: ');
		                }
		            } else {
		                alert('Error recuperando datos de localización: ' + status);
		            }
		            $(elem).removeClass('animated infinite flash');
		        });
		    }, function() {
		        alert('Error geolocalizando: Debes aceptar los permisos de geolocalización para autocompletar la dirección.');
		        $(elem).removeClass('animated infinite bounce');
		    });
	    }
        
        // Ajax response Functions
        function updateFormFields(data) {
	        fillInAddress(data.results[0]);
	    }
	    function handleAjaxError(error, msg, errorThrown) {
	            alert(msg);
	            alert(errorThrown);
	            alert('Error accediendo a datos de localización...');
	    }
        
        function handleGeolocationFail(error) {
	        if (error.readyState === "0" && navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                alert("No se puede geolocalizar debido a los addons que tienes en tu navegador, por favor deshabilítalos para geolocalizarte.");
            } else {
                alert("No se puede geolocalizar debido a la configuración de seguridad de tu navegador.");
            }
            alert('error:' + error);
	    }
JS;
		Yii::app()->clientScript->registerScript(__CLASS__.'geolocation-js', $this->minimizeScript($js), CClientScript::POS_READY);
	}
}


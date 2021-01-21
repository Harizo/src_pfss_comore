(function ()
{
    "use strict";

    angular
        .module("fuse")

		.constant("apiUrl", "http://localhost/2020/pfss_comore/api/index.php/api/")
		.constant("apiUrlbase", "http://localhost/2020/pfss_comore/")
		.constant('apiUrlExcel', "http://localhost/2020/pfss_comore/exportexcel/")

	
		.constant("apiUrlvalidationbeneficiaire", "validationdonnees/beneficiaire/")
		.constant("apiUrlvalidationintervention", "validationdonnees/intervention/")
		.constant("apiUrlrecommandation", "recommandation/")
		.constant("apiUrlcanevasformate", "canevasformate/");

		
})();

(function ()
{
    "use strict";

    angular
        .module("fuse")

		.constant("apiUrl", "http://localhost/2020/pfss_comores/api/index.php/api/")
		.constant("apiUrlbase", "http://localhost/2020/pfss_comores/")
		.constant('apiUrlExcel', "http://localhost/2020/pfss_comores/exportexcel/")
		.constant('apiUrlExcelimport', "http://localhost/2020/pfss_comores/importexcel/")
		.constant('apiUrlReporting', "http://localhost/2020/pfss_comores/reporting/")
		.constant("apiUrl_serve_central", "http://localhost/2020/pfss_comores/api/index.php/api/")//ip serveur cantrale si dans les ile pour l'envoi des données
		.constant("serveur_central", true)

		//SERVEUR LOCAL
			/* .constant("apiUrl", "https://mis.island-agro.com/2020/pfss_comores/api/index.php/api/")
			.constant("apiUrlbase", "https://mis.island-agro.com/2020/pfss_comores/")
			.constant('apiUrlExcel', "https://mis.island-agro.com/2020/pfss_comores/exportexcel/")
			.constant('apiUrlExcelimport', "https://mis.island-agro.com/2020/pfss_comores/importexcel/")

			.constant("apiUrl_serve_central", "https://mis.island-agro.com/2020/pfss_comores/api/index.php/api/")//ip serveur cantrale si dans les ile pour l'envoi des données
			.constant("serveur_central", true) */


		//FIN SERVEUR LOCAL

	
		.constant("apiUrlvalidationbeneficiaire", "validationdonnees/beneficiaire/")
		.constant("apiUrlvalidationintervention", "validationdonnees/intervention/")
		.constant("apiUrlrecommandation", "recommandation/")
		.constant("apiUrlcanevasformate", "canevasformate/");

		
})();

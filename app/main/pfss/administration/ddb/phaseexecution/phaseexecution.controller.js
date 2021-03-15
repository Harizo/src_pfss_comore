(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.phaseexecution')
        .controller('PhaseexecutionController', PhaseexecutionController);

    /** @ngInject */
    function PhaseexecutionController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore)
	{		
		var vm = this;
		var id_utilisateur = $cookieStore.get('id');
    vm.serveur_central = serveur_central ;
		vm.affiche = true;

		/* ***************Debut type phaseexecution**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                    apiFactory.getAll("phaseexecution/index").then(function success(response)
                    {
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,
                          Code:       e.data.models[0].Code,      
                          Phase:      e.data.models[0].Phase,      
                          montantalloue:      e.data.models[0].montantalloue,      
                          indemnite:      e.data.models[0].indemnite,      
                          datefin:     convertionDate(e.data.models[0].datefin) ,      
                          datedebut:      convertionDate(e.data.models[0].datedebut)              
                      });
                  apiFactory.add("phaseexecution/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : phase execution de Phase de " + e.data.models[0].Phase,
                              id_utilisateur: id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                   
                     
                },
                //suppression ile
                destroy: function (e)
                {
					// Demande de confirmation de suppression
					var confirm = $mdDialog.confirm()
						.title('Etes-vous sûr de supprimer cet enregistrement ?')
						.textContent('')
						.ariaLabel('Lucky day')
						.clickOutsideToClose(true)
						.parent(angular.element(document.body))
						.ok('supprimer')
						.cancel('annuler');
					$mdDialog.show(confirm).then(function() {  
						// demande de confirmation de suppression OK => enregitrement à supprimer
						var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
						var datas = $.param({
								supprimer: 1,
								id:        e.data.models[0].id               
							});
						apiFactory.add("phaseexecution/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : phase execution de Phase de " + e.data.models[0].Phase,
									  id_utilisateur: id_utilisateur
							  });
									
							  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							  });
						  /***********Fin add historique***********/
						}).error(function (data) {
							vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
						});
					}, function() {
						// Aucune action = sans suppression
					});               
                },
                //creation ile
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,
                            Code:       e.data.models[0].Code,      
                            Phase:      e.data.models[0].Phase,      
                            montantalloue:      e.data.models[0].montantalloue,      
                            indemnite:      e.data.models[0].indemnite,      
                            datefin:      convertionDate(e.data.models[0].datefin),      
                            datedebut:      convertionDate(e.data.models[0].datedebut)             
                        });
                    apiFactory.add("phaseexecution/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : phase execution de Phase de " + e.data.models[0].Phase,
                                id_utilisateur: id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
                    /***********Fin add historique***********/

                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });
                },
            },
                
            //data: valueMapCtrl.dynamicData,
            batch: true,
            autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        Code: {type: "string",validation: {required: true}},
                        Phase: {type: "string", validation: {required: true}},
                        montantalloue: {type: "number", validation: {required: true}},
                        indemnite: {type: "number", validation: {required: true}},
                        datedebut: {type: "date", validation: {required: true}},
                        datefin: {type: "date", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: '<label id="table_titre">Phase executionr</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addphaseexecution" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addphaseexecution" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'phaseexecution\/index\',\'phaseexecution\')">' 
			   				+'<md-icon md-font-icon="icon-box-download"></md-icon>'
							+'<md-tooltip><span>Download</span></md-tooltip>'
						+'</a>'
          }],
          editable:{ mode:"inline",update: true,destroy: true},
          //selectable:"row",
          sortable: true,
          //pageable: true,
          reorderable: true,
          scrollable: false,              
          filterable: true,
          //groupable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          
          //dataBound: function() {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "Code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "Phase",
              title: "Phase",
              width: "Auto"
            },
            {
              field: "indemnite",
              title: "Indemnite",
              width: "Auto"
            },
            {
              field: "datedebut",
              title: "Date debut",
              format: "{0: dd-MM-yyyy}",
              width: "Auto"
            },{
              field: "datefin",
              title: "Date fin",
              format: "{0: dd-MM-yyyy}",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      click: function (e){
                        e.preventDefault();
                        var row = $(e.currentTarget).closest("tr");
                        
                        var data = this.dataItem(row);
                        
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };

		  
      /* ***************Fin type phaseexecution**********************/ 
      		/* ***************Debut annee**********************/  
        vm.mainGridOptionsannee =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                    apiFactory.getAll("annee/index").then(function success(response)
                    {
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,
                          annee:       e.data.models[0].annee             
                      });
                  apiFactory.add("annee/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : annee de annee de " + e.data.models[0].annee,
                              id_utilisateur: id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                   
                     
                },
                //suppression ile
                destroy: function (e)
                {
					// Demande de confirmation de suppression
					var confirm = $mdDialog.confirm()
						.title('Etes-vous sûr de supprimer cet enregistrement ?')
						.textContent('')
						.ariaLabel('Lucky day')
						.clickOutsideToClose(true)
						.parent(angular.element(document.body))
						.ok('supprimer')
						.cancel('annuler');
					$mdDialog.show(confirm).then(function() {  
						// demande de confirmation de suppression OK => enregitrement à supprimer
						var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
						var datas = $.param({
								supprimer: 1,
								id:        e.data.models[0].id               
							});
						apiFactory.add("annee/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : annee de annee de " + e.data.models[0].annee,
									  id_utilisateur: id_utilisateur
							  });
									
							  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							  });
						  /***********Fin add historique***********/
						}).error(function (data) {
							vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
						});
					}, function() {
						// Aucune action = sans suppression
					});               
                },
                //creation ile
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,
                            annee:       e.data.models[0].annee             
                        });
                    apiFactory.add("annee/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : annee de annee de " + e.data.models[0].annee,
                                id_utilisateur: id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
                    /***********Fin add historique***********/

                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });
                },
            },
                
            //data: valueMapCtrl.dynamicData,
            batch: true,
            autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                      annee: {type: "string",validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: '<label id="table_titre">Annee</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addannee" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addannee" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'annee\/index\',\'annee\')">' 
			   				+'<md-icon md-font-icon="icon-box-download"></md-icon>'
							+'<md-tooltip><span>Download</span></md-tooltip>'
						+'</a>'
          }],
          editable:{ mode:"inline",update: true,destroy: true},
          //selectable:"row",
          sortable: true,
          //pageable: true,
          reorderable: true,
          scrollable: false,              
          filterable: true,
          //groupable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          
          //dataBound: function() {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "annee",
              title: "Annee",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      click: function (e){
                        e.preventDefault();
                        var row = $(e.currentTarget).closest("tr");
                        
                        var data = this.dataItem(row);
                        
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };

		  
      /* ***************Fin type annee**********************/ 



  vm.download_ddb = function(controller,table)
  {
    var nbr_data_insert = 0 ;
    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    vm.affiche_load = true;
    apiFactory.getAll_acteur_serveur_central(controller).then(function(result){
      var ddb = result.data.response;

      var datas_suppr = $.param({
          supprimer:1,
          nom_table: table,
        }); 

      apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {

          //add ddb
            ddb.forEach( function(element, index)
            {	
              
              switch (table) {
                case "phaseexecution":
                  
                  var datas = $.param({
                    supprimer: 0,
                    etat_download:true,
                    id:element.id,
                    Code:       element.Code,      
                    Phase:      element.Phase,      
                    montantalloue:      element.montantalloue,      
                    indemnite:      element.indemnite,      
                    datefin:      element.datefin,      
                    datedebut:      element.datedebut             
                });  
                  break;
                case "annee":
                  
                  var datas = $.param({
                    supprimer: 0,
                    etat_download:true,
                    id:element.id,
                    annee:       element.annee             
                });  
                  break;
                default:
                  // statements_def
                  break;
              }							

              apiFactory.add(controller,datas, config).success(function (data) {
                nbr_data_insert++ ;
                if ((index+1) == ddb.length) //affichage Popup
                {
                  vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s ! Veuillez rafraichir la page');
                 /* switch (table) 
                  {
                    case "type_indicateur":
                      vm.mainGridOptions.dataSource.read();
                      break;
                    case "indicateur":
                      vm.allindicateur.dataSource.read();
                      break;
                      case "composante_indicateur":
                        vm.allcomposante_indicateur.dataSource.read();
                        break;
                    
                    default:

                      break;
                  }*/
                  
                  vm.affiche_load = false;
                }
              }).error(function (data) {
                vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
                if ((index+1) == ddb.length) //affichage Popup
                {
                  /*switch (table) 
                  {
                    case "type_indicateur":
                      vm.mainGridOptions.dataSource.read();
                      break;
                    case "indicateur":
                      vm.allindicateur.dataSource.read();
                      break;
                      case "composante_indicateur":
                        vm.allcomposante_indicateur.dataSource.read();
                        break;
                    
                    default:

                      break;
                  }*/
                }
                vm.affiche_load = false;
              });
            });
          //add ddb

        }).error(function (data) {
          vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
        });
      

      

    /*	switch (table) 
      {
        case "type_infrastructure":
          vm.mainGridOptions.dataSource.read();
          break;
        case "infrastructure":
          vm.allinfrastructure.dataSource.read();
          break;
        
        default:

          break;
      }*/

    });  
  }
		vm.showAlert = function(titre,textcontent)
		{
			$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(false)
				.parent(angular.element(document.body))
				.title(titre)
				.textContent(textcontent)
				.ariaLabel('Alert Dialog Demo')
				.ok('Fermer')
				.targetEvent()
			);
		}
    function convertionDate(daty)
    { 
        var date_final = null;  
        if(daty!='Invalid Date' && daty!='' && daty!=null)
        {
            console.log(daty);
            var date     = new Date(daty);
            var jour  = date.getDate();
            var mois  = date.getMonth()+1;
            var annee = date.getFullYear();
            if(mois <10)
            {
                mois = '0' + mois;
            }
            date_final= annee+"-"+mois+"-"+jour;
        }
        return date_final;      
    }	
    }
  })();

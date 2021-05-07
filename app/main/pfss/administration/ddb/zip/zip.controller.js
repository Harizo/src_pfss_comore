(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.zip')
        .controller('ZipController', ZipController);

    /** @ngInject */
    function ZipController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore)
	{		
		var vm = this;
		var id_utilisateur = $cookieStore.get('id');
		vm.serveur_central = serveur_central ;
		vm.affiche = true;
		/* ***************Debut milieu**********************/  
        vm.mainGridMilieu =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation milieu
                read: function (e)
                {
                    apiFactory.getAll("milieu/index").then(function success(response)
                    {
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification milieu
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          description:       e.data.models[0].description               
                      });
                  apiFactory.add("milieu/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Milieu de description de " + e.data.models[0].description,
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
                //suppression milieu
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
						apiFactory.add("milieu/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : Milieu de description de " + e.data.models[0].description,
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
                //creation milieu
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            description:       e.data.models[0].description              
                        });
                    apiFactory.add("milieu/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Milieu de description de " + e.data.models[0].description,
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
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: '<label id="table_titre">Milieu</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addzip" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addmilieu" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'milieu\/index\',\'milieu\')">' 
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
              field: "description",
              title: "Libelle",
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
      /* ***************Fin milieu**********************/ 
		/* ***************Debut vague**********************/  
        vm.mainGridVague =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation vague
                read: function (e)
                {
                    apiFactory.getAll("vague/index").then(function success(response)
                    {
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification vague
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          description:       e.data.models[0].description               
                      });
                  apiFactory.add("vague/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Vague de description de " + e.data.models[0].description,
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
                //suppression vague
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
						apiFactory.add("vague/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : Vague de description de " + e.data.models[0].description,
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
                //creation vague
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            description:       e.data.models[0].description              
                        });
                    apiFactory.add("vague/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Vague de description de " + e.data.models[0].description,
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
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: '<label id="table_titre">Vague</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addzip" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addmilieu" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'vague\/index\',\'vague\')">' 
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
              field: "description",
              title: "Libelle",
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
      /* ***************Fin vague**********************/ 
		/* ***************Debut zip**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation zip
                read: function (e)
                {
                    apiFactory.getAll("zip/index").then(function success(response)
                    {
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification zip
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          libelle:      e.data.models[0].libelle,
                          code:       e.data.models[0].code               
                      });
                  apiFactory.add("zip/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : zip de libelle de " + e.data.models[0].libelle,
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
                //suppression zip
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
						apiFactory.add("zip/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : zip de libelle de " + e.data.models[0].libelle,
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
                //creation zip
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            code:      e.data.models[0].code,
                            libelle:       e.data.models[0].libelle              
                        });
                    apiFactory.add("zip/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : zip de libelle de " + e.data.models[0].libelle,
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
                        code: {type: "string",validation: {required: true}},
                        libelle: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: '<label id="table_titre">ZIP</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addzip" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addzip" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'zip\/index\',\'zip\')">' 
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
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "libelle",
              title: "Libelle",
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
      /* ***************Fin zip**********************/ 
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
                case "zip":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle
                  });   
                  break;
                case "communaute":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle,
                    id_type_infrastructure: element.id_type_infrastructure,
                    id_commune: element.commune.id
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
                  vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s !Veuillez rafraichir la page');
                 /* switch (table) 
                  {
                    case "zip":
                      vm.mainGridOptions.dataSource.read();
                      break;
                    case "communaute":
                      vm.allcommunaute.dataSource.read();
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
                 /* switch (table) 
                  {                    
                    case "zip":
                      vm.mainGridOptions.dataSource.read();
                      break;
                    case "communaute":
                      vm.allcommunaute.dataSource.read();
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
    }
  })();

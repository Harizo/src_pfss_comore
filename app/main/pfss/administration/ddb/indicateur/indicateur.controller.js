(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.indicateur')
        .controller('IndicateurController', IndicateurController);

    /** @ngInject */
    function IndicateurController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore,$mdSidenav)
	{		
		var vm = this;
		var id_utilisateur = $cookieStore.get('id');
    vm.serveur_central = serveur_central ;
		vm.affiche = true;

		/* ***************Debut type indicateur**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                    apiFactory.getAll("type_indicateur/index").then(function success(response)
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
                          libelle:      e.data.models[0].libelle,
                          code:       e.data.models[0].code               
                      });
                  apiFactory.add("type_indicateur/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : type indicateur de libelle de " + e.data.models[0].libelle,
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
						apiFactory.add("type_indicateur/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : type indicateur de libelle de " + e.data.models[0].libelle,
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
                            code:      e.data.models[0].code,
                            libelle:       e.data.models[0].libelle              
                        });
                    apiFactory.add("type_indicateur/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : type indicateur de libelle de " + e.data.models[0].libelle,
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
               template: '<label id="table_titre">Type indicateur</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addindicateur" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addindicateur" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'type_indicateur\/index\',\'type_indicateur\')">' 
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
		/*vm.click_download_bdd = function(event)
		  {
			  vm.mainGridOptions.dataSource.read(e)
        {
          e.success(null);
        }
		  }*/  
      /* ***************Fin type indicateur**********************/ 
	  
	  /* ***************Debut composante indicateur**********************/

      vm.allcomposante_indicateur = function(type_indicateur_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation district
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("composante_indicateur/index","menu","getcomposante_indicateurbytype","id_type_indicateur",type_indicateur_id).then(function(result)
                {
                    e.success(result.data.response);

                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification district
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          libelle:       e.data.models[0].libelle,
                          id_type_indicateur: type_indicateur_id               
                      });
                  apiFactory.add("composante_indicateur/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Composante indicateur de libelle de " + e.data.models[0].libelle,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });       
              },

              //supression district
              destroy : function (e)
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
						apiFactory.add("composante_indicateur/index",datas, config).success(function (data) {                
							e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : composante indicateur de libelle de " + e.data.models[0].libelle,
									id_utilisateur:vm.id_utilisateur
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
              //creation district
              create : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          libelle:       e.data.models[0].libelle,
                          id_type_indicateur: type_indicateur_id               
                      });
                  
                  apiFactory.add("composante_indicateur/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_type_indicateur=type_indicateur_id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Composant indicateur de libelle de " + e.data.models[0].libelle,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/ 

                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    }); 

              }
            },
            batch: true,
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
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: '<label id="table_titre">Composante</label>'
							+'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
							+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addcomposant" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'composante_indicateur\/index\',\'composante_indicateur\')">' 
							+'<md-icon md-font-icon="icon-box-download"></md-icon>'
							+'<md-tooltip><span>Download</span></md-tooltip>'
						+'</a>'
          }],
          editable: {
            mode:"inline"
          },
          //selectable:"row",
          scrollable: false,
          sortable: true,
          filterable: true,
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
                   // this.expandRow(this.tbody.find("tr.k-master-row").first());
               // },
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
                     // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };

	  /* ***************Fin composante indicateur**********************/
    	  
	  /* ***************Debut indicateur**********************/

    vm.allindicateur = function(composante_indicateur_id) {
      return {
        dataSource:
        {
          type: "json",
          transport: {
            //recuperation district
            read: function (e)
            {
              apiFactory.getAPIgeneraliserREST("indicateur/index","menu","getindicateurbycomposante","id_composante_indicateur",composante_indicateur_id).then(function(result)
              {
                  e.success(result.data.response);

              }, function error(result)
                {
                    vm.showAlert('Erreur','Erreur de lecture');
                })
            },
            //modification district
            update : function (e)
            {
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              
                var datas = $.param({
                        supprimer: 0,
                        id:        e.data.models[0].id,      
                        code:      e.data.models[0].code,
                        libelle:       e.data.models[0].libelle,
                        frequence:       e.data.models[0].frequence,
                        utilisation:       e.data.models[0].utilisation,
                        unite:       e.data.models[0].unite,
                        id_composante_indicateur: composante_indicateur_id               
                    });
                apiFactory.add("indicateur/index",datas, config).success(function (data)
                {                
                  e.success(e.data.models);

                /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                            action:"Modification : Indicateur de libelle de " + e.data.models[0].libelle,
                            id_utilisateur:vm.id_utilisateur
                    });
                          
                    apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                    });
                /***********Fin add historique***********/

                }).error(function (data)
                  {
                    vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                  });       
            },

            //supression district
            destroy : function (e)
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
          apiFactory.add("indicateur/index",datas, config).success(function (data) {                
            e.success(e.data.models);
            /***********Debut add historique***********/
            var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            var datas = $.param({
                action:"Suppression : Indicateur de libelle de " + e.data.models[0].libelle,
                id_utilisateur:vm.id_utilisateur
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
            //creation district
            create : function (e)
            {
                
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                var datas = $.param({
                        supprimer: 0,
                        id:        0,      
                        code:      e.data.models[0].code,
                        libelle:       e.data.models[0].libelle,
                        frequence:       e.data.models[0].frequence,
                        utilisation:       e.data.models[0].utilisation,
                        unite:       e.data.models[0].unite,
                        id_composante_indicateur: composante_indicateur_id               
                    });
                
                apiFactory.add("indicateur/index",datas, config).success(function (data)
                { 
                  
                    e.data.models[0].id = String(data.response);                    
                    e.data.models[0].id_composante_indicateur=composante_indicateur_id;                                 
                    e.success(e.data.models);

                /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                            action:"Creation : Indicateur de libelle de " + e.data.models[0].libelle,
                            id_utilisateur:vm.id_utilisateur
                    });
                          
                    apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                    });
                /***********Fin add historique***********/ 

                }).error(function (data)
                  {
                    vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                  }); 

            }
          },
          batch: true,
          schema:
          {
              model:
              {
                  id: "id",
                  fields:
                  {
                      code: {type: "string",validation: {required: true}},
                      libelle: {type: "string", validation: {required: true}},
                      frequence: {type: "string", validation: {required: true}},
                      utilisation: {type: "string", validation: {required: true}},
                      unite: {type: "string", validation: {required: true}}
                  }
              }
          },
          //serverPaging: true,
          //serverSorting: true,
          serverFiltering: true,
          pageSize: 5,
        },
        toolbar: [{               
             template: '<label id="table_titre">Indicateur</label>'
            +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
            +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
            +'<md-tooltip><span>Ajout</span></md-tooltip>'
          +'</a>'
          +'<a class="k-button k-button-icontext addindicateur" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'indicateur\/index\',\'indicateur\')">' 
            +'<md-icon md-font-icon="icon-box-download"></md-icon>'
            +'<md-tooltip><span>Download</span></md-tooltip>'
          +'</a>'
        }],
        editable: {
          mode:"inline"
        },
        //selectable:"row",
        scrollable: false,
        sortable: true,
        filterable: true,
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
                 // this.expandRow(this.tbody.find("tr.k-master-row").first());
             // },
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
            field: "frequence",
            title: "Frequence Remontée",
            width: "Auto"
          },
          {
            field: "utilisation",
            title: "Utilisation",
            width: "Auto"
          },
          {
            field: "unite",
            title: "Unité",
            width: "Auto"
          },
          { 
            title: "Action",
            width: "Auto",
            command:[{
                    name: "edit",
                    text: {edit: "",update: "",cancel: ""},
                   // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                     // },
                },{name: "destroy", text: ""}]
          }]
      };
    };

  /* ***************Fin composante indicateur**********************/


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
                case "type_indicateur":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle
                  });   
                  break;
                case "composante_indicateur":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle,
                    id_type_indicateur: element.id_type_indicateur
                  }); 
                  break;
                  case "indicateur":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle,
                    frequence: element.frequence,
                    utilisation: element.utilisation,
                    unite: element.unite,
                    id_composante_indicateur: element.id_composante_indicateur
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
    }
  })();

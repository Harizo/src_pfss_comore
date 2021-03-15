(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.type_infrastructure')
        .controller('Type_infrastructureController', Type_infrastructureController);

    /** @ngInject */
    function Type_infrastructureController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore,$mdSidenav)
	{		
		var vm = this;
		var id_utilisateur = $cookieStore.get('id');
    vm.serveur_central = serveur_central ;
		vm.affiche = true;

		// Methods
        vm.toggleSidenav = toggleSidenav;
		vm.selected_item = {};

        //////////

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
			console.log('aiza');
        }
		vm.allitem_infrastructure = [{id: '1', nom: 'Infrastructure'},{id: '2', nom: 'AGR'},{id: '3', nom: 'Activité'}]
		
		vm.selectionItem_infrastructure = function(infras)
        {
          vm.selected_item = infras ;
          switch (infras.id) 
                    {
                      case "1":
                        vm.titre_contenu="CONTENU INFRASTRUCTURE";
                        break;
                      case "2":
                        vm.titre_contenu="CONTENU AGR";
                        break;
                        case "3":
                          vm.titre_contenu="CONTENU ACTIVITE";
                          break;
                      
                      default:

                        break;
                    }
        }

        $scope.$watch('vm.selected_item', function()
        {
          if (!vm.allitem_infrastructure) return;
          vm.allitem_infrastructure.forEach(function(item)
          {
             item.$selected = false;
          });
          vm.selected_item.$selected = true;
		  console.log( vm.allitem_infrastructure);
        });
		/* ***************Debut type infrastructure**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                    apiFactory.getAll("type_infrastructure/index").then(function success(response)
                    {
                        e.success(response.data.response);
                        vm.selected_item = vm.allitem_infrastructure[0];
                        console.log(vm.selected_item);
                        vm.titre_contenu="CONTENU INFRASTRUCTURE";
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
                  apiFactory.add("type_infrastructure/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : type infrastructure de libelle de " + e.data.models[0].libelle,
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
						apiFactory.add("type_infrastructure/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : type infrastructure de libelle de " + e.data.models[0].libelle,
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
                    apiFactory.add("type_infrastructure/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : type infrastructure de libelle de " + e.data.models[0].libelle,
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
               template: '<label id="table_titre">Type infrastructure</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addinfrastructure" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addinfrastructure" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'type_infrastructure\/index\',\'type_infrastructure\')">' 
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
      /* ***************Fin type infrastrucure**********************/ 
	  
	  /* ***************Debut infrastructure**********************/

      vm.allinfrastructure = function(type_infrastructure_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation district
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("infrastructure/index","menu","getinfrastructurebytype","id_type_infrastructure",type_infrastructure_id).then(function(result)
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
                          id_type_infrastructure: type_infrastructure_id               
                      });
                  apiFactory.add("infrastructure/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Infrastructure de libelle de " + e.data.models[0].libelle,
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
						apiFactory.add("infrastructure/index",datas, config).success(function (data) {                
							e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : Infrastructure de libelle de " + e.data.models[0].libelle,
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
                          id_type_infrastructure: type_infrastructure_id               
                      });
                  
                  apiFactory.add("infrastructure/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_type_infrastructure=type_infrastructure_id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Infrastructurede libelle de " + e.data.models[0].libelle,
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
               template: '<label id="table_titre">Infrastructure</label>'
							+'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
							+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addinfrastructure" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'infrastructure\/index\',\'infrastructure\')">' 
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

	  /* ***************Fin infrastructure**********************/
    /* ***************Debut AGR**********************/  
    vm.alltype_agr =
    {
      dataSource: new kendo.data.DataSource({
         
        transport:
        {   
          //recuperation ile
            read: function (e)
            {
                apiFactory.getAll("type_agr/index").then(function success(response)
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
              apiFactory.add("type_agr/index",datas, config).success(function (data)
              {                
                e.success(e.data.models);

                /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                          action:"Modification : type AGR de libelle de " + e.data.models[0].libelle,
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
        apiFactory.add("type_agr/index",datas, config).success(function (data)
        {                
          e.success(e.data.models);
          /***********Debut add historique***********/
            var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            var datas = $.param({
                action:"Suppression : type AGR de libelle de " + e.data.models[0].libelle,
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
                apiFactory.add("type_agr/index",datas, config).success(function (data)
                { 
                  e.data.models[0].id = String(data.response);               
                  e.success(e.data.models);

                  /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                            action:"Creation : type AGR de libelle de " + e.data.models[0].libelle,
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
           template: '<label id="table_titre">Type AGR</label>'
             +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
             +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
          +'<md-tooltip><span>Ajout</span></md-tooltip>'
        +'</a>'
        +'<a class="k-button k-button-icontext" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'type_agr\/index\',\'type_agr\')">' 
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
  /* ***************Fin type AGR*********************/ 

  	  /* ***************Debut activite agr**********************/

      vm.allactivite_agr = function(type_agr_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation district
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("activite_agr/index","menu","getactivite_agrbytype","id_type_agr",type_agr_id).then(function(result)
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
                          id_type_agr: type_agr_id               
                      });
                  apiFactory.add("activite_agr/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : activite AGR de libelle de " + e.data.models[0].libelle,
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
						apiFactory.add("activite_agr/index",datas, config).success(function (data) {                
							e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : activite AGR de libelle de " + e.data.models[0].libelle,
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
                          id_type_agr: type_agr_id               
                      });
                  
                  apiFactory.add("activite_agr/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_type_agr=type_agr_id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : activite AGR de libelle de " + e.data.models[0].libelle,
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
               template: '<label id="table_titre">Activite AGR</label>'
							+'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
							+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addactivite_agr" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'activite_agr\/index\',\'activite_agr\')">' 
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

	  /* ***************Fin activite_agr**********************/

        /* ***************Debut activite agr**********************/  
        vm.alltype_activite_act =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                    apiFactory.getAll("type_activite_act/index").then(function success(response)
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
                  apiFactory.add("type_activite_act/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);
    
                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : type activite act de libelle de " + e.data.models[0].libelle,
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
            apiFactory.add("type_activite_act/index",datas, config).success(function (data)
            {                
              e.success(e.data.models);
              /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                    action:"Suppression : type activite act de libelle de " + e.data.models[0].libelle,
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
                    apiFactory.add("type_activite_act/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);
    
                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : type activite act de libelle de " + e.data.models[0].libelle,
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
               template: '<label id="table_titre">Type Activite act</label>'
                 +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
                 +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
              +'<md-tooltip><span>Ajout</span></md-tooltip>'
            +'</a>'
            +'<a class="k-button k-button-icontext" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'type_activite_act\/index\',\'type_activite_act\')">' 
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
      /* ***************Fin type AGR*********************/ 
    
          /* ***************Debut activite act**********************/
    
          vm.allactivite_act = function(type_activite_act_id) {
            return {
              dataSource:
              {
                type: "json",
                transport: {
                  //recuperation district
                  read: function (e)
                  {
                    apiFactory.getAPIgeneraliserREST("activite_act/index","menu","getactivite_actbytype","id_type_activite_act",type_activite_act_id).then(function(result)
                    {
                        e.success(result.data.response);
                      console.log('okk');
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
                              id_type_activite_act: type_activite_act_id               
                          });
                      apiFactory.add("activite_act/index",datas, config).success(function (data)
                      {                
                        e.success(e.data.models);
    
                      /***********Debut add historique***********/
                          var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                          var datas = $.param({
                                  action:"Modification : activite act de libelle de " + e.data.models[0].libelle,
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
                apiFactory.add("activite_act/index",datas, config).success(function (data) {                
                  e.success(e.data.models);
                  /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                      action:"Suppression : activite act de libelle de " + e.data.models[0].libelle,
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
                              id_type_activite_act: type_activite_act_id               
                          });
                      
                      apiFactory.add("activite_act/index",datas, config).success(function (data)
                      { 
                        
                          e.data.models[0].id = String(data.response);                    
                          e.data.models[0].id_type_activite_act=type_activite_act_id;                                 
                          e.success(e.data.models);
    
                      /***********Debut add historique***********/
                          var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                          var datas = $.param({
                                  action:"Creation : activite act de libelle de " + e.data.models[0].libelle,
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
                   template: '<label id="table_titre">Activite act</label>'
                  +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
                  +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
                  +'<md-tooltip><span>Ajout</span></md-tooltip>'
                +'</a>'
                +'<a class="k-button k-button-icontext addactivite_act" href="\\#" ng-if="vm.serveur_central" ng-click="vm.download_ddb(\'activite_act\/index\',\'activite_act\')">' 
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
    
        /* ***************Fin activite_act**********************/


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
                case "type_infrastructure":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle
                  });   
                  break;
                case "infrastructure":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle,
                    id_type_infrastructure: element.id_type_infrastructure
                  }); 
                  break;
                  case "type_agr":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle
                  });   
                  break;
                  case "activite_agr":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle,
                    id_type_agr: element.id_type_agr
                  });   
                  break;
                  case "type_activite_act":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle
                  });   
                  break;
                  case "activite_act":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    libelle: element.libelle,
                    id_type_activite_act: element.id_type_activite_act
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
                  /*switch (table) 
                  {
                    case "type_infrastructure":
                      vm.mainGridOptions.dataSource.read();
                      break;
                    case "infrastructure":
                      vm.allinfrastructure.dataSource.read();
                      break;
                    case "type_agr":
                        vm.allinfrastructure.dataSource.read();
                      break;
                    case "activite_agr":
                        vm.allactivite_agr.dataSource.read();
                      break;
                    case "type_activite_act":
                          vm.alltype_activite_act.dataSource.read();
                      break;
                    case "activite_act":
                            vm.allactivite_act();
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
                    case "type_infrastructure":
                      vm.mainGridOptions.dataSource.read();
                      break;
                    case "infrastructure":
                      vm.allinfrastructure.dataSource.read();
                      break;
                    case "type_agr":
                        vm.allinfrastructure.dataSource.read();
                      break;
                    case "activite_agr":
                        vm.allactivite_agr.dataSource.read();
                      break;
                    case "type_activite_act":
                          vm.alltype_activite_act.dataSource.read();
                      break;
                    case "activite_act":
                            vm.allactivite_act.dataSource.read();
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

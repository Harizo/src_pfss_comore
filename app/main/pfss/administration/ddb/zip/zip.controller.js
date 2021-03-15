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

    /*apiFactory.getAPIgeneraliserREST("commune/index","menu","getdropdowncommunaute").then(function(result)
        {
          vm.allcommune= result.data.response;
          console.log(vm.allcommune);
        });*/

		/* ***************Debut type indicateur**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
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
		/*vm.click_download_bdd = function(event)
		  {
			  vm.mainGridOptions.dataSource.read(e)
        {
          e.success(null);
        }
		  }*/  
      /* ***************Fin type indicateur**********************/ 
	  
	  /* ***************Debut composante indicateur**********************/

    /*  vm.allcommunaute = function(zip_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation district
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebyzip","id_zip",zip_id).then(function(result)
                {
                    e.success(result.data.response);
                  console.log(result.data.response);
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
                          id_zip: zip_id,      
                          id_commune:        e.data.models[0].commune.id               
                      });
                  apiFactory.add("communaute/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : communaute de libelle de " + e.data.models[0].libelle,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });

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
						apiFactory.add("communaute/index",datas, config).success(function (data) {                
							e.success(e.data.models);
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : communaute de libelle de " + e.data.models[0].libelle,
									id_utilisateur:vm.id_utilisateur
							});                             
							apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							});
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
                          id_zip: zip_id ,      
                          id_commune:        e.data.models[0].commune              
                      });
                  
                  apiFactory.add("communaute/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_zip=zip_id; 
                      var itemsCommune =
                      {
                        id: e.data.models[0].commune,
                        Commune: vm.nomcommune
                      };
                      e.data.models[0].commune=itemsCommune;                                 
                      e.success(e.data.models);

                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : communaute de libelle de " + e.data.models[0].libelle,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });

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
                        commune: {validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: '<label id="table_titre">Communaute</label>'
							+'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
							+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addcommunaute" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'communaute\/index\',\'communaute\')">' 
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
              field: "commune",
              title: "Commune",
              template: "{{dataItem.commune.Commune}}",
              editor: communeDropDownEditor,
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
      function communeDropDownEditor(container, options)
          {
            $('<input id="communeDropDownEditor" required data-text-field="Commune" data-value-field="id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: "Commune",
                    dataValueField: "id_commune",
                    dataSource: vm.allcommune           
                }); 
                var communeContener = container.find("#communeDropDownEditor").data("kendoDropDownList");
          
                    communeContener.bind("change", function() {
                    vm.nomcommune = communeContener.text();
              
            });
          }*/

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

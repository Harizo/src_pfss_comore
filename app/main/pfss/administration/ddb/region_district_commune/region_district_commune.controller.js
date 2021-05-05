(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.decoup_admin')
        .controller('Region_district_communeController', Region_district_communeController);
    /** @ngInject */
    function Region_district_communeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
        var vm = this;
        var NouvelItem =false;
        vm.id_utilisateur = $cookieStore.get('id'); 

/***********DEBUT add historique***********/

        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
          action:"Consultation : Découpage admninistratif",
          id_utilisateur:$cookieStore.get('id')
        });
        
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });

/***********FIN add historique***********/        

/* ***************DEBUT Découpage admninistratif**********************/
      
      /* ***************Debut ile**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                    apiFactory.getAll("ile/index").then(function success(response)
                    {console.log(response.data.response);
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
                          Code:      e.data.models[0].Code,
                          Ile:       e.data.models[0].Ile               
                      });
                  apiFactory.add("ile/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Ile de nom de " + e.data.models[0].Ile,
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
						apiFactory.add("ile/index",datas, config).success(function (data)  {                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : Ile de nom de " + e.data.models[0].nom,
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
                //creation ile
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            Code:      e.data.models[0].Code,
                            Ile:       e.data.models[0].Ile              
                        });
                    apiFactory.add("ile/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Ile de nom de " + e.data.models[0].Ile,
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
                        Ile: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: "<label id='table_titre'>ILE </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
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
              field: "Ile",
              title: "Ile",
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
                        console.log(e);
                        var data = this.dataItem(row);
                        console.log(data);
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };
      /* ***************Fin ile**********************/

      /* ***************Debut region**********************/

      vm.allregion = function(ile_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation district
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",ile_id).then(function(result)
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
                          Code:      e.data.models[0].Code,
                          Region:       e.data.models[0].Region,
                          ile_id: e.data.models[0].ile.id               
                      });
                  apiFactory.add("district/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Région de nom de " + e.data.models[0].Region,
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
						apiFactory.add("district/index",datas, config).success(function (data) {                
							e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : District de nom de " + e.data.models[0].nom,
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
                          Code:      e.data.models[0].Code,
                          Region:       e.data.models[0].Region,
                          ile_id: ile_id               
                      });
                  
                  apiFactory.add("district/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].ile={id:ile_id};                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Région de nom de " + e.data.models[0].Region,
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
                        Code: {type: "string",validation: {required: true}},
                        nom: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>REGION </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
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
              field: "Code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "Region",
              title: "Region",
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
      /* ***************Fin district**********************/

      /* ***************Debut commune**********************/
      vm.allcommune = function(region_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation commune
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",region_id).then(function(result)
                {console.log(result.data.response);
                    e.success(result.data.response);
                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification commune
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          Code:      e.data.models[0].Code,
                          Commune:       e.data.models[0].Commune,
                          region_id: e.data.models[0].region.id               
                      });
                  apiFactory.add("commune/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : Commune de nom de " + e.data.models[0].Commune,
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
              //suppression commune
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
						apiFactory.add("commune/index",datas, config).success(function (data) {                
							e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : Commune de nom de " + e.data.models[0].nom,
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
              //creation commune
              create : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          Code:      e.data.models[0].Code,
                          Commune:       e.data.models[0].Commune,
                          region_id: region_id              
                      });
                  
                  apiFactory.add("commune/index",datas, config).success(function (data)
                  { 
                    
                    e.data.models[0].id = String(data.response);
                    
                    e.data.models[0].region={id:region_id};              
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Commune de nom de " + e.data.models[0].Commune,
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
                        Code: {type: "string",validation: {required: true}},
                        Commune: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>COMMUNE </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
          }],
          editable: {
            mode:"inline"
          },
          //selectable:"row",
          scrollable: false,
          sortable: true,
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
              field: "Code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "Commune",
              title: "Commune",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      //iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };
    /* ***************Fin commune**********************/
    apiFactory.getAll("zip/index").then(function(result)
    {
      vm.allZip= result.data.response;
    });
    /* ***************Debut village**********************/
      vm.allvillage = function(commune_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation village
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",commune_id).then(function(result)
                {console.log(result.data.response);
                    e.success(result.data.response)
                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification village
              update : function (e)
              {                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  console.log(e);
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          Code:      e.data.models[0].Code,
                          Village:       e.data.models[0].Village,
                          commune_id: e.data.models[0].commune_id,
                          id_zip:   e.data.models[0].zip.id,
                          vague: e.data.models[0].vague               
                      });
                      //console.log(datas); 
                  apiFactory.add("village/index",datas, config).success(function (data)
                  {                
                     e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Village de nom de " + e.data.models[0].Village,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/ 
                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    });       
              },
              //suppression village
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
						apiFactory.add("village/index",datas, config).success(function (data) {                
							e.success(e.data.models);                    
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
								  action:"Suppression : Village de nom de  " + e.data.models[0].Village,
								  id_utilisateur:vm.id_utilisateur
							});                          
							apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							});
							/***********Fin add historique***********/ 
						}).error(function (data)  {
						  vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
						});     
					}, function() {
						// Aucune action = sans suppression
					});					
              },
              //creation village
              create : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          Code:      e.data.models[0].Code,
                          Village:       e.data.models[0].Village,
                          commune_id: commune_id,                          
                          id_zip:   e.data.models[0].zip,
                          vague:       e.data.models[0].vague              
                      });
                  apiFactory.add("village/index",datas, config).success(function (data)
                  { 
                    
                    e.data.models[0].id = String(data.response);
                    
                    //e.data.models[0].commune={id:commune_id}; 
                    e.data.models[0].commune_id= commune_id; 
                    var itemsZip =
                      {
                        id: e.data.models[0].zip,
                        libelle: vm.libellezip
                      };
                      e.data.models[0].zip=itemsZip;             
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Village de nom de " + e.data.models[0].Village,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/ 
                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
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
                        Code: {type: "string",validation: {required: true}},
                        Village: {type: "string", validation: {required: true}},
                        vague: {type: "number", validation: {required: true}},
                        zip: {validation: {required: true}}

                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>VILLAGE </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"
               
          }],
          editable: {
            mode:"inline"
          },
          //selectable:"row",
          scrollable: false,
          sortable: true,
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
              field: "Code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "Village",
              title: "Village",
              width: "Auto"
            },
            {
              field: "vague",
              title: "Vague",
              width: "Auto"
            },
            {
              field: "zip",
              title: "Zip",
              template: "{{dataItem.zip.libelle}}",
              editor: zipDropDownEditor,
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      //iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };
      

      function zipDropDownEditor(container, options)
      {
            $('<input id="zipDropDownList" change="vm.mande()" required data-text-field="libelle" data-value-field="id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: "libelle",
                    dataValueField: "id_zip",
                    dataSource: vm.allZip           
                }); 
                var zipContener = container.find("#zipDropDownList").data("kendoDropDownList");
          
          zipContener.bind("change", function()
          {
            vm.libellezip = zipContener.text();
            console.log(vm.libellezip);
    
          });
     }
    /* ***************Fin village**********************/
/* ***************FIN Découpage admninistratif**********************/
        
        //Alert
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }
    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.population.ddb_adm.nomenclatureintervention')
        .controller('NomenclatureinterventionController', NomenclatureinterventionController);
    /** @ngInject */
    function NomenclatureinterventionController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)
    {
        var vm = this;
        var NouvelItem =false;
        vm.id_utilisateur = $cookieStore.get('id'); 
/***********DEBUT add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
          action:"Consultation : Nomenclature intervention",
          id_utilisateur:$cookieStore.get('id')
        });
        
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
/***********FIN add historique***********/        
/* ***************DEBUT Nomenclature intervention**********************/   
      /* ***************Debut nomenclature niveau 1**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({            
            transport:
            {   
              //recuperation nomenclature niveau 1
                read: function (e)
                {
                    apiFactory.getAll("nomenclature_intervention1/index").then(function success(response)
                    {console.log(response.data.response);
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification nomenclature niveau 1
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description               
                      });
                  apiFactory.add("nomenclature_intervention1/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Nomenclature intervention niveau 1 de description : " + e.data.models[0].description,
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
                //suppression nomenclature niveau 1
                destroy: function (e)
                {
                    
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 1,
                            id:        e.data.models[0].id               
                        });
                    apiFactory.add("nomenclature_intervention1/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                          var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                          var datas = $.param({
                                  action:"Suppression : Nomenclature intervention niveau 1 de description : " + e.data.models[0].description,
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
                //creation nomenclature niveau 1
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            code:      e.data.models[0].code,
                            description:       e.data.models[0].description              
                        });
                    apiFactory.add("nomenclature_intervention1/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Nomenclature intervention niveau 1 de description : " + e.data.models[0].description,
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
                        code: {type: "string",validation: {required: true}},
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
               template: "<label id='table_titre'>NOMENCLATURE INTERVENTION </label>"
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
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
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
      /* ***************Fin nomenclature niveau 1 **********************/

      /* ***************Debut nomenclature niveau 2**********************/

      vm.allnomenclature2 = function(id_nomenclature1) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation nomenclature niveau 2
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("nomenclature_intervention2/index","cle_etrangere",id_nomenclature1).then(function(result)
                {
                    e.success(result.data.response);

                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification nomenclature niveau 2
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_nomenclature1: e.data.models[0].nomenclature_intervention1.id               
                      });
                  apiFactory.add("nomenclature_intervention2/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Nomenclature intervention niveau 2 de description : " + e.data.models[0].description,
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

              //supression nomenclature niveau 2
              destroy : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 1,
                          id:        e.data.models[0].id               
                      });
                  
                  apiFactory.add("nomenclature_intervention2/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Suppression : Nomenclature intervention niveau 2 de description : " + e.data.models[0].description,
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
              //creation nomenclature niveau 2
              create : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_nomenclature1: id_nomenclature1               
                      });
                  
                  apiFactory.add("nomenclature_intervention2/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].nomenclature_intervention1={id:id_nomenclature1};                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Nomenclature intervention niveau 2 de description : " + e.data.models[0].description,
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
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>Niveau 2 </label>"
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
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
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
      /* ***************Fin nomenclature niveau 2**********************/

      /* ***************Debut nomenclature niveau 3**********************/
      vm.allnomenclature3 = function(id_nomenclature2) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation nomenclature niveau 3
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("nomenclature_intervention3/index","cle_etrangere",id_nomenclature2).then(function(result)
                {console.log(result.data.response);
                    e.success(result.data.response);
                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification nomenclature niveau 3
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_nomenclature2: e.data.models[0].nomenclature_intervention2.id               
                      });
                  apiFactory.add("nomenclature_intervention3/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : Nomenclature intervention niveau 3 de description : " + e.data.models[0].description,
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
              //suppression nomenclature niveau 3
              destroy : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 1,
                          id:        e.data.models[0].id               
                      });
                  
                  apiFactory.add("nomenclature_intervention3/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Suppression : Nomenclature intervention niveau 3 de description : " + e.data.models[0].description,
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
              //creation nomenclature niveau 3 
              create : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_nomenclature2: id_nomenclature2              
                      });
                  
                  apiFactory.add("nomenclature_intervention3/index",datas, config).success(function (data)
                  { 
                    
                    e.data.models[0].id = String(data.response);
                    
                    e.data.models[0].nomenclature_intervention2={id:id_nomenclature2};              
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Nomenclature intervention niveau 3 de description : " + e.data.models[0].description,
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
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>Niveau 3 </label>"
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
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
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
    /* ***************Fin nomenclature niveau 3**********************/

    /* ***************Debut nomenclature niveau 4**********************/
      vm.allnomenclature4 = function(id_nomenclature3) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation nomenclature niveau 4
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("nomenclature_intervention4/index","cle_etrangere",id_nomenclature3).then(function(result)
                {console.log(result.data.response);
                    e.success(result.data.response)
                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification nomenclature niveau 4
              update : function (e)
              {                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_nomenclature3: e.data.models[0].nomenclature_intervention3.id               
                      });
                  apiFactory.add("nomenclature_intervention4/index",datas, config).success(function (data)
                  {                
                     e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Nomenclature intervention niveau 4 de description : " + e.data.models[0].description,
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
              //suppression nomenclature niveau 4
              destroy : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 1,
                          id:        e.data.models[0].id               
                      });
                  
                  apiFactory.add("nomenclature_intervention4/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);                    

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Suppression : Nomenclature intervention niveau 4 de description :  " + e.data.models[0].description,
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
              //creation nomenclature niveau 4
              create : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          latitude:  e.data.models[0].latitude,
                          longitude: e.data.models[0].longitude,
                          id_nomenclature3: id_nomenclature3              
                      });
                  apiFactory.add("nomenclature_intervention4/index",datas, config).success(function (data)
                  { 
                    
                    e.data.models[0].id = String(data.response);
                    
                    e.data.models[0].nomenclature_intervention3={id:id_nomenclature3};              
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Nomenclature intervention niveau 4 de description : " + e.data.models[0].description,
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
                        code: {type: "string",validation: {required: true}},
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>Niveau 4 </label>"
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
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
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
    /* ***************Fin nomenclature niveau 4**********************/
/* ***************FIN Nomenclature intervention**********************/
        
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

(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.planactionreinstallation')
        .controller('PlanactionreinstallationController', PlanactionreinstallationController);
    /** @ngInject */
    function PlanactionreinstallationController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)  {
        var vm = this;
        var NouvelItem =false;
		vm.ajoutSous_projet = ajoutSous_projet ;
		var NouvelItemSous_projet=false;
		var currentItemSous_projet;
		vm.selectedItemSous_projet = {} ;
		vm.allRecordsSous_projet = [] ;
		vm.allRecordsPlan_action = [] ;
		vm.sous_projet_column =[
		{titre:"Plan d'action réinstallation"},
		{titre:"Code"},
		{titre:"Description"},
		{titre:"Action"}
		];
		apiFactory.getAll("sous_projet/index").then(function(result){
			vm.allRecordsSous_projet = result.data.response;
		});    		
		apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
			vm.allRecordsPlan_action = result.data.response;
		});    		
        vm.id_utilisateur = $cookieStore.get('id'); 
		vm.allReponse=[{id:1,libelle:"Oui"},{id:0,libelle:"Non"}];
/***********DEBUT add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
          action:"Consultation : Plan action réinstallation",
          id_utilisateur:$cookieStore.get('id')
        });
        
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
/***********FIN add historique***********/    
		
		// Début Sous projet
		function ajoutSous_projet(ss_p,suppression) {
            
            if (NouvelItemSous_projet==false) 
              {
                test_existenceSous_projet (ss_p,suppression); 
              }
              else
              {
                insert_in_baseSous_projet(ss_p,suppression);
              }
        }
        function insert_in_baseSous_projet(ss_p,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemSous_projet==false) {
			   getId = vm.selectedItemSous_projet.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: ss_p.code,      
				description: ss_p.description,      
				id_par: ss_p.id_par,      
			});       
			//factory
			apiFactory.add("sous_projet/index",datas, config).success(function (data)
			{	
				if (NouvelItemSous_projet == false) {
					// Update or delete: id exclu 
					//console.log('noufalse');                  
					if(suppression==0) {
					  vm.selectedItemSous_projet.code = ss_p.code;
					  vm.selectedItemSous_projet.description = ss_p.description;
					  vm.selectedItemSous_projet.id_par = ss_p.id_par;
					  vm.selectedItemSous_projet.plan_action_reinstallation = ss_p.plan_action_reinstallation;
					  vm.selectedItemSous_projet ={};
					} else {    
						vm.allRecordsSous_projet = vm.allRecordsSous_projet.filter(function(obj) {
							return obj.id !== vm.selectedItemSous_projet.id;
						});
					}
				} else {
					ss_p.id=data.response;
					NouvelItemSous_projet=false;
				}
				ss_p.$selected=false;
				ss_p.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionSous_projet= function (item) {     
            vm.selectedItemSous_projet = item;
        };
        $scope.$watch('vm.selectedItemSous_projet', function() {
			if (!vm.allRecordsSous_projet) return;
			vm.allRecordsSous_projet.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemSous_projet.$selected = true;
        });
        //function cache masque de saisie
        vm.ajouterSous_projet = function () {
            vm.selectedItemSous_projet.$selected = false;
            NouvelItemSous_projet = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: '',
                description: '',
                id_par: null,
                plan_action_reinstallation: '',
			};
			vm.allRecordsSous_projet.unshift(items);
		    vm.allRecordsSous_projet.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemSous_projet = it;
				}
			});			
        };
        vm.annulerSous_projet = function(item) {
			if (!item.id) {
				vm.allRecordsSous_projet.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemSous_projet = false;
			item.code = currentItemSous_projet.code;
			item.description = currentItemSous_projet.description;
			item.id_par = currentItemSous_projet.id_par;
			item.plan_action_reinstallation = currentItemSous_projet.plan_action_reinstallation;
			vm.selectedItemSous_projet = {} ;
			vm.selectedItemSous_projet.$selected = false;
       };
        vm.modifierSous_projet = function(item) {
			NouvelItemSous_projet = false ;
			vm.selectedItemSous_projet = item;
			currentItemSous_projet = angular.copy(vm.selectedItemSous_projet);
			$scope.vm.allRecordsSous_projet.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.code = vm.selectedItemSous_projet.code;
			item.description = vm.selectedItemSous_projet.description;
			item.id_par = vm.selectedItemSous_projet.id_par;
			item.plan_action_reinstallation = vm.selectedItemSous_projet.plan_action_reinstallation;
			item.$edit = true;
        };
        vm.supprimerSous_projet = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajoutSous_projet(vm.selectedItemSous_projet,1);
			}, function() {
			});
        }
        function test_existenceSous_projet (item,suppression)
        {
			if (suppression!=1) 
            {
                var ag = vm.allRecordsSous_projet.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ag[0])
                {
                  if((ag[0].code!=currentItemSous_projet.code) ||(ag[0].description!=currentItemSous_projet.description) ||(ag[0].id_par!=currentItemSous_projet.id_par))                    
                      { 
                         insert_in_baseSous_projet(item,suppression);                         
                      }
                      else
                      { 
                        item.$selected=false;
						item.$edit=false;
                      }
                }
            }
            else
              insert_in_baseSous_projet(item,suppression);		
        }
        vm.modifierPAR = function (item) { 
			vm.nontrouvee=true;
			vm.allRecordsPlan_action.forEach(function(umes) {
				if(parseInt(umes.id)==parseInt(item.id_par)) {
					item.id_par = umes.id; 
					item.plan_action_reinstallation = umes.intitule; 
					vm.nontrouvee=false;
				}
			});
			if(vm.nontrouvee==true) {				
					vm.acteur.id_par = null; 
					vm.acteur.plan_action_reinstallation=null;
			}
		}
		
		// Fin Sous projet    
      /* ***************Debut liste variable**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation liste variable
                read: function (e)
                {
                    apiFactory.getAll("plan_action_reinstallation/index").then(function success(response)
                    {
                        e.success(response.data.response);
						vm.allRecordsPlan_action=response.data.response;
						console.log(vm.allRecordsPlan_action);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification liste reponse
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:          e.data.models[0].id,      
                          intitule:        e.data.models[0].intitule,
                          description: e.data.models[0].description,              
                      });
                  apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Plan d'action réinstallation  " + e.data.models[0].description,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
						// Nouvel liste PAR
						vm.allRecordsPlan_action=[];
						apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
							vm.allRecordsPlan_action = result.data.response;
						});    		
						// Nouvel liste PAR					  
                  /***********Fin add historique***********/
                  }).error(function (data)  {
						vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                                       
                },
                //suppression liste reponse
                destroy: function (e)
                {    // ETO O               
					var confirm = $mdDialog.confirm()
						.title("Vous-êtes en train de supprimer cet enregistrement.Continuer ?")
						.textContent('')
						.ariaLabel('Lucky day')
						.clickOutsideToClose(true)
						.parent(angular.element(document.body))
						.ok('Continuer')
						.cancel('annuler');
					$mdDialog.show(confirm).then(function() {          
						var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
						var datas = $.param({
								supprimer: 1,
								id:        e.data.models[0].id               
							});
						apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : Plan d'action réinstallation  " + e.data.models[0].description,
									  id_utilisateur:vm.id_utilisateur
							  });                               
							  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							  });
						  /***********Fin add historique***********/
							// Nouvel liste PAR
							vm.allRecordsPlan_action=[];
							apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
								vm.allRecordsPlan_action = result.data.response;
							});    		
							// Nouvel liste PAR					  
						}).error(function (data)  {
							vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
						});  
					}, function() {
					});				  
                },
                //creation liste reponse
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            intitule:      e.data.models[0].intitule,
                            description:       e.data.models[0].description,             
                       });
                    apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);
                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Plan d'action réinstallation " + e.data.models[0].description,
                                id_utilisateur:vm.id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
                    /***********Fin add historique***********/
						// Nouvel liste PAR
						vm.allRecordsPlan_action=[];
						apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
							vm.allRecordsPlan_action = result.data.response;
						});    		
						// Nouvel liste PAR					  
                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });
                },
            },               
            //data: valueMapCtrl.dynamicData,
            batch: true,
            // autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        intitule: {type: "string",validation: {required: true}},
                        description: {type: "string", validation: {required: true}},
                    }
                }
            },
            pageSize: 8 //nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),         
          // height: 550,
          toolbar: [{               
               template: "<label id='table_titre'>Liste Plan d'action réinstallation </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"              
          }],
          editable: {
            mode:"inline"
          },
          selectable:"row",
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
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "intitule",
              title: "Intitulé",
              width: "Auto"
            },
            {
              field: "description",
              title: "Déscription",
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
		  
		function ChoixuniqueDropDownEditor(container, options) {
            $('<input id="choixuniqueDropDownList" change="vm.mande()" required data-text-field="libelle" data-value-field="id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: "libelle",
                    dataValueField: "choix_unique",
                    dataSource: vm.allReponse         
                }); 
                var choixuniqueContener = container.find("#choixuniqueDropDownList").data("kendoDropDownList");
          
				choixuniqueContener.bind("change", function() {
				vm.libelleChoixunique = choixuniqueContener.text();
				console.log(vm.libelleChoixunique);  
			});
        }
		 
		  
      /* ***************Fin liste variable**********************/
      /* ***************Debut détail variable**********************/
      vm.alldetailplanaction = function(id_par) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation valeur reponse
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("activite_par/index","cle_etrangere",id_par).then(function(result)
                {
                    e.success(result.data.response);
					console.log(result.data.response);
                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification valeur reponse
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};               
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          description:       e.data.models[0].description,
                          id_par: id_par               
                      });
                  apiFactory.add("activite_par/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Activité P.A.R " + e.data.models[0].description,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de la modification de donnée');
                    });       
              },
              //supression reponse
              destroy : function (e)
              {			  
				var confirm = $mdDialog.confirm()
					.title("Vous-êtes en train d'importer cet enregistrement.Continuer ?")
					.textContent('')
					.ariaLabel('Lucky day')
					.clickOutsideToClose(true)
					.parent(angular.element(document.body))
					.ok('Continuer')
					.cancel('annuler');
				$mdDialog.show(confirm).then(function() {          
					  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                 
					  var datas = $.param({
							  supprimer: 1,
							  id:        e.data.models[0].id               
						  });                 
					  apiFactory.add("activite_par/index",datas, config).success(function (data) {                
						e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : Activité P.A.R " + e.data.models[0].description,
									id_utilisateur:vm.id_utilisateur
							});                             
							apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							});
							/***********Fin add historique***********/ 
						}).error(function (data) {
						  vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
						});      
				}, function() {
				});				  
              },
              //creation détail reponse
              create : function (e)
              {                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          description:       e.data.models[0].description,
                          id_par: id_par               
                      });
                  apiFactory.add("activite_par/index",datas, config).success(function (data)
                  {                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].liste_variable={id:id_par};                                 
                      e.success(e.data.models);
                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Activité P.A.R " + e.data.models[0].description,
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
                        description: {type: "string", validation: {required: true}},
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>Activité Plan d'action réinstallation</label>"
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
              field: "description",
              title: "Déscription",
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
      /* ***************Fin détail reponse**********************/
		vm.download_ddb = function(controller,table)
		{
			var nbr_data_insert = 0 ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};

			apiFactory.getAll_acteur_serveur_central(controller).then(function(result){
				var ddb = result.data.response;

				console.log(ddb);
				var datas_suppr = $.param({
						supprimer:1,
						nom_table: table,
					}); 

				apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
						//add ddb
							ddb.forEach( function(element, index) {
								switch (table) {
									case "plan_action_reinstallation":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											intitule: element.intitule,
											description: element.description,
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
										vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s !');
									}
								}).error(function (data) {
									vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
								});
							});
							
						//add ddb
							var datas_suppr = $.param({
								supprimer:1,
								nom_table: "activite_par",
							}); 
							apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
								apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
									var ddbs = result.data.response;
									ddbs.forEach( function(element, index) {
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											id_par: element.id_par,
											description: element.description,
										});   
										apiFactory.add("activite_par/index",datas, config).success(function (data) {
											nbr_data_insert++ ;
											if ((index+1) == ddbs.length) //affichage Popup
											{
												vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s !');
											}
										}).error(function (data) {
											vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
										});
									});
								});  
							});  						
					}).error(function (data) {
						vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
					});
				switch (table) 
				{
					case "plan_action_reinstallation":
						vm.allRecordsAgent_ex = ddb ;
						break;
					default:

						break;
				}

			});  
		}
	  
	  
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

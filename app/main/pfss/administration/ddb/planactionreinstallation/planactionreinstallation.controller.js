(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.planactionreinstallation')
        .controller('PlanactionreinstallationController', PlanactionreinstallationController);
    /** @ngInject */
    function PlanactionreinstallationController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore, serveur_central)  {
        var vm = this;
        var NouvelItem =false;
        vm.serveur_central = serveur_central;
        vm.detail_sousprojet = false;
		vm.ajoutSous_projet = ajoutSous_projet ;
		var NouvelItemSous_projet=false;
		var currentItemSous_projet;
		vm.selectedItemSous_projet = {} ;
		vm.allRecordsSous_projet = [] ;
		vm.allRecordsPlan_action = [] ;

    
		vm.ajoutFiltration_env = ajoutFiltration_env ;
		var NouvelItemFiltration_env=false;
		var currentItemFiltration_env;
		vm.selectedItemFiltration_env = {} ;
		vm.allFiltration_env = [] ;
    
		vm.selected_itemdetail_sousprojet = {};
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
            vm.detail_sousprojet = true;
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

    vm.allitem_detail_sousprojet = [
      {id: '1', nom: 'Quantité des travaux'},
      {id: '2', nom: 'Outillages et Matériaux '},	
      {id: '3', nom: 'Main d’œuvre et rémunération' },
      {id: '4', nom: 'Planning d’exécution' },
      {id: '5', nom: 'Estimations de dépenses'},
      {id: '6', nom: 'Indicateurs'},
      {id: '7', nom: 'Résultats attendus '},
      /*{id: '8', nom: 'Sauvegarde environnementale'},
      {id: '9', nom: 'Filtration environnementale'},
      {id: '10', nom: 'Aspects environnementale'},
      {id: '11', nom: 'Problemes environnementale'}*/
    ];
    vm.click_detail_sousprojet = function()
    {
      vm.mainGridOptionstravaux.dataSource.read();
    }
    vm.selectionItem_detail_sousprojet = function(detail)
    {
          vm.selected_itemdetail_sousprojet = detail ;
          switch (detail.id) 
                    {
                      case "1":
                        vm.titre_contenu="CONTENU QUANTITE DES TRAVAUX";
                        vm.mainGridOptionstravaux.dataSource.read();
                        break;
                      case "2":
                        vm.titre_contenu="CONTENU OUTILLAGE ET MATERIAUX";
                        vm.mainGridOptionsO_Materiaux.dataSource.read();
                        break;
                      case "3":
                          vm.titre_contenu="CONTENU MAIN D'OEUVRE ET REMUNERATION";
                          vm.mainGridOptionsMain_renume.dataSource.read();
                        break;
                     
                      case "4":
                        vm.titre_contenu="CONTENU PLANNING D'EXECUTION";
                        vm.mainGridOptionsPlanning.dataSource.read();
                        break;
                      case "5":
                        vm.titre_contenu="CONTENU ESTIMATIONS DE DEPENSES";
                        vm.mainGridOptionsDepenses.dataSource.read();
                        break;
                      case "6":
                          vm.titre_contenu="CONTENU INDICATEURS";
                          vm.mainGridOptionsIndicateurs.dataSource.read();
                        break;
                      case "7":
                          vm.titre_contenu="CONTENU RESULTATS ATTENDUS";
                          vm.mainGridOptionsResultats.dataSource.read();
                        break; 
                     
                     /* case "8":
                        vm.titre_contenu="CONTENU SAUVEGARDE ENVIRONNEMENTALE";
                        vm.mainGridOptionsSauvegarde_env.dataSource.read();
                        break;
                      case "9":
                        vm.titre_contenu="CONTENU FILTRATION ENVIRONNEMENTALE";
                        vm.mainGridOptionsFiltration_env.dataSource.read();
                        break;
                      case "10":
                          vm.titre_contenu="CONTENU ASPECTS ENVIRONNEMENTALE";
                          vm.mainGridOptionsAspects_env.dataSource.read();
                        break;
                      case "11":
                          vm.titre_contenu="CONTENU PROBLEMES ENVIRONNEMENTALE";
                          vm.mainGridOptionsProbllemes_env.dataSource.read();
                        break;*/
                      default:

                        break;
                    }
        }

        $scope.$watch('vm.selected_itemdetail_sousprojet', function()
        {
          if (!vm.allitem_detail_sousprojet) return;
          vm.allitem_detail_sousprojet.forEach(function(item)
          {
             item.$selected = false;
          });
          vm.selected_itemdetail_sousprojet.$selected = true;
        });
	  	  
        /* ***************Debut sous projet travaux**********************/

        vm.mainGridOptionstravaux =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                  if (vm.selectedItemSous_projet.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_travaux/index","menu","getsous_projet_travauxbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
                    {
                        e.success(result.data.response);
    
                    }, function error(result)
                      {
                          vm.showAlert('Erreur','Erreur de lecture');
                      });
                  }
                  else
                  {
                   e.success('');
                  }
                  
                  vm.selected_itemdetail_sousprojet = vm.allitem_detail_sousprojet[0];
                  vm.titre_contenu="CONTENU QUANTITE DES TRAVAUX";
                  
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                    var datas = $.param({
                            supprimer: 0,
                            id:        e.data.models[0].id,      
                            activites:      e.data.models[0].activites,
                            unite:       e.data.models[0].unite,
                            quantite:       e.data.models[0].quantite,
                            observation:       e.data.models[0].observation,
                            id_sous_projet : e.data.models[0].id_sous_projet               
                        });
                    apiFactory.add("sous_projet_travaux/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models);
  
                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : quantités des travaux de activites de " + e.data.models[0].activites,
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
                  apiFactory.add("sous_projet_travaux/index",datas, config).success(function (data) {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                        action:"Suppression : quantités des travaux de activites de " + e.data.models[0].activites,
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
                          activites:      e.data.models[0].activites,
                          unite:       e.data.models[0].unite,
                          quantite:       e.data.models[0].quantite,
                          observation:       e.data.models[0].observation,
                          id_sous_projet: vm.selectedItemSous_projet.id              
                      });
                  
                  apiFactory.add("sous_projet_travaux/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : quantités des travaux de activites de " + e.data.models[0].activites,
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
                      activites: {type: "string",validation: {required: true}},
                      unite: {type: "string", validation: {required: true}},
                      quantite: {type: "number",validation: {required: true}},
                      observation: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
              template: '<label id="table_titre">Quatités des travaux</label>'
              +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
              +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
              +'<md-tooltip><span>Ajout</span></md-tooltip>'
            +'</a>'
            +'<a class="k-button k-button-icontext addproblemes_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sous_projet_travaux\/index\',\'sous_projet_travaux\')">' 
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
              field: "activites",
              title: "Activites",
              width: "Auto"
            },
            {
              field: "unite",
              title: "Unite",
              width: "Auto"
            },
            {
              field: "quantite",
              title: "Quantite",
              width: "Auto"
            },
            {
              field: "observation",
              title: "Observation",
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
  
      /* ***************Fin sous projet travaux**********************/

        /* ***************Debut outillage et materiaux**********************/

        vm.mainGridOptionsO_Materiaux =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                { 
                  if (vm.selectedItemSous_projet.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_materiels/index","menu","getsous_projet_materielsbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
                    {
                        e.success(result.data.response);  
                    }, function error(result)
                      {
                          vm.showAlert('Erreur','Erreur de lecture');
                      });
                  }
                  else
                  {
                   e.success('');
                  }
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                    var datas = $.param({
                            supprimer: 0,
                            id:        e.data.models[0].id,      
                            designation:      e.data.models[0].designation,
                            unite:       e.data.models[0].unite,      
                            quantite:      e.data.models[0].quantite,
                            prix_unitaire:       e.data.models[0].prix_unitaire,
                            prix_total:       e.data.models[0].prix_total,
                            id_sous_projet : e.data.models[0].id_sous_projet               
                        });
                    apiFactory.add("sous_projet_materiels/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models);
  
                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : OUTILLAGES ET MATERIAUX de designation de " + e.data.models[0].designation,
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
                  apiFactory.add("sous_projet_materiels/index",datas, config).success(function (data) {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                        action:"Suppression : OUTILLAGES ET MATERIAUX de designation de " + e.data.models[0].designation,
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
                          designation:      e.data.models[0].designation,
                          unite:       e.data.models[0].unite,      
                          quantite:      e.data.models[0].quantite,
                          prix_unitaire:       e.data.models[0].prix_unitaire,
                          prix_total:       e.data.models[0].prix_total,
                          id_sous_projet: vm.selectedItemSous_projet.id              
                      });
                  
                  apiFactory.add("sous_projet_materiels/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : OUTILLAGES ET MATERIAUX de designation de " + e.data.models[0].designation,
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
                      designation: {type: "string",validation: {required: true}},
                      unite: {type: "string", validation: {required: true}},
                      quantite: {type: "number",validation: {required: true}},
                      prix_unitaire: {type: "number", validation: {required: true}},
                      prix_total: {type: "number",validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
              template: '<label id="table_titre">OUTILLAGES ET MATERIAUX</label>'
              +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
              +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
              +'<md-tooltip><span>Ajout</span></md-tooltip>'
            +'</a>'
            +'<a class="k-button k-button-icontext addoutillageetmateriaux" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sous_projet_materiels\/index\',\'sous_projet_materiels\')">' 
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
              field: "designation",
              title: "Designation",
              width: "Auto"
            },
            {
              field: "unite",
              title: "Unite",
              width: "Auto"
            },
            {
              field: "quantite",
              title: "Quantite",
              width: "Auto"
            },
            {
              field: "prix_unitaire",
              title: "Prix unitaire",
              width: "Auto"
            },
            {
              field: "prix_total",
              title: "Prix total",
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
  
      /* ***************Fin outillage et materiaux**********************/

      /* ***************Debut main d'oeuvre**********************/

      vm.mainGridOptionsMain_renume =
      {
        dataSource: new kendo.data.DataSource({
           
          transport:
          {   
            //recuperation ile
              read: function (e)
              { 
                if (vm.selectedItemSous_projet.id)
                {
                  apiFactory.getAPIgeneraliserREST("sous_projet_main_oeuvre/index","menu","getsous_projet_main_oeuvrebysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
                  {
                      e.success(result.data.response);  
                  }, function error(result)
                    {
                        vm.showAlert('Erreur','Erreur de lecture');
                    });
                }
                else
                {
                 e.success('');
                }
                
              },
              //modification ile
              update : function (e)
              {
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          activite:      e.data.models[0].activite,     
                          main_oeuvre:      e.data.models[0].main_oeuvre,    
                          post_travail:      e.data.models[0].post_travail,
                          remuneration_jour:       e.data.models[0].remuneration_jour,
                          nbr_jour:       e.data.models[0].nbr_jour,
                          remuneration_total:       e.data.models[0].remuneration_total,
                          id_sous_projet : e.data.models[0].id_sous_projet               
                      });
                  apiFactory.add("sous_projet_main_oeuvre/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Main d'eauvre et renumeration d'activite de " + e.data.models[0].activite,
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
                apiFactory.add("sous_projet_main_oeuvre/index",datas, config).success(function (data) {                
                  e.success(e.data.models);
                  /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                      action:"Suppression : Main d'eauvre et renumeration d'activite  de " + e.data.models[0].activite,
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
                        activite:      e.data.models[0].activite,
                        main_oeuvre:      e.data.models[0].main_oeuvre,
                        post_travail:      e.data.models[0].post_travail,
                        remuneration_jour:       e.data.models[0].remuneration_jour,
                        nbr_jour:       e.data.models[0].nbr_jour,
                        remuneration_total:       e.data.models[0].remuneration_total,
                        id_sous_projet: vm.selectedItemSous_projet.id              
                    });
                
                apiFactory.add("sous_projet_main_oeuvre/index",datas, config).success(function (data)
                { 
                  
                    e.data.models[0].id = String(data.response);                    
                    e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                    e.success(e.data.models);

                /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                            action:"Creation : Main d'eauvre et renumeration d'activite  de " + e.data.models[0].activite,
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
                      activite: {type: "string",validation: {required: true}},
                      main_oeuvre: {type: "number", validation: {required: true,min: 1}},
                      post_travail: {type: "string", validation: {required: true}},
                      remuneration_jour: {type: "number", validation: {required: true,min: 0.0001}},
                      nbr_jour: {type: "number", validation: {required: true,min: 1}},
                      remuneration_total: {type: "number", validation: {required: true,min: 0.0001}}
                  }
              }
          },

          pageSize: 10//nbr affichage
          //serverPaging: true,
          //serverSorting: true
        }),
        
        // height: 550,
        toolbar: [{               
            template: '<label id="table_titre">MAIN D\'OEUVRE</label>'
            +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
            +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
            +'<md-tooltip><span>Ajout</span></md-tooltip>'
          +'</a>'
          +'<a class="k-button k-button-icontext addmainoeuvre" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sous_projet_main_oeuvre\/index\',\'sous_projet_main_oeuvre\')">' 
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
            field: "activite",
            title: "Activite",
            width: "Auto"
          },
          {
            field: "main_oeuvre",
            title: "Main d\'oeuvre",
            width: "Auto"
          },
          {
            field: "post_travail",
            title: "Post de travail",
            width: "Auto"
          },
          {
            field: "remuneration_jour",
            title: "Rémuneration par jour",
            width: "Auto"
          },
          {
            field: "nbr_jour",
            title: "Nombre du jour",
            width: "Auto"
          },
          {
            field: "remuneration_total",
            title: "Rémuneration total",
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

    /* ***************Fin main d'oeuvre et renumeration**********************/
  
    
      /* ***************Debut outillage et materiaux**********************/

      vm.mainGridOptionsPlanning =
      {
        dataSource: new kendo.data.DataSource({
           
          transport:
          {   
            //recuperation ile
              read: function (e)
              {
                if (vm.selectedItemSous_projet.id)
                { 
                  apiFactory.getAPIgeneraliserREST("sous_projet_planning/index","menu","getsous_projet_planningbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
                  {
                      e.success(result.data.response);  
                  }, function error(result)
                    {
                        vm.showAlert('Erreur','Erreur de lecture');
                    });
                }
                else
                {
                 e.success('');
                }
                
              },
              //modification ile
              update : function (e)
              {
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,     
                          code:      e.data.models[0].code,     
                          phase_activite:      e.data.models[0].phase_activite,     
                          numero_phase:      e.data.models[0].numero_phase,
                          id_sous_projet : e.data.models[0].id_sous_projet               
                      });
                  apiFactory.add("sous_projet_planning/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Planning de numero de phase de " + e.data.models[0].numero_phase,
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
                apiFactory.add("sous_projet_planning/index",datas, config).success(function (data) {                
                  e.success(e.data.models);
                  /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                      action:"Suppression : Planning de numero de phase de de " + e.data.models[0].numero_phase,
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
                        code:      e.data.models[0].code,     
                        phase_activite:      e.data.models[0].phase_activite,     
                        numero_phase:      e.data.models[0].numero_phase,
                        id_sous_projet: vm.selectedItemSous_projet.id              
                    });
                
                apiFactory.add("sous_projet_planning/index",datas, config).success(function (data)
                { 
                  
                    e.data.models[0].id = String(data.response);                    
                    e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                    e.success(e.data.models);

                /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                            action:"Creation : Planning de numero de phase de " + e.data.models[0].numero_phase,
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
                      phase_activite: {type: "string", validation: {required: true}},
                      numero_phase: {type: "number", validation: {required: true,min: 1}}
                  }
              }
          },

          pageSize: 10//nbr affichage
          //serverPaging: true,
          //serverSorting: true
        }),
        
        // height: 550,
        toolbar: [{               
            template: '<label id="table_titre">PLANNING</label>'
            +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
            +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
            +'<md-tooltip><span>Ajout</span></md-tooltip>'
          +'</a>'
          +'<a class="k-button k-button-icontext addplanning" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sous_projet_planning\/index\',\'sous_projet_planning\')">' 
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
            field: "phase_activite",
            title: "Phase activite",
            width: "Auto"
          },
          {
            field: "numero_phase",
            title: "Numero de phase",
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

    /* ***************Fin planning**********************/

    /* ***************Debut depenses*********************/

        vm.mainGridOptionsDepenses =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                { 
                  if (vm.selectedItemSous_projet.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_depenses/index","menu","getsous_projet_depensesbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
                    {
                        e.success(result.data.response);  
                    }, function error(result)
                      {
                          vm.showAlert('Erreur','Erreur de lecture');
                      });
                  }
                  else
                  {
                   e.success('');
                  } 
                  
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                    var datas = $.param({
                            supprimer: 0,
                            id:        e.data.models[0].id,      
                            designation:      e.data.models[0].designation,
                            montant:       e.data.models[0].montant,
                            pourcentage:       e.data.models[0].pourcentage,
                            id_sous_projet : e.data.models[0].id_sous_projet               
                        });
                    apiFactory.add("sous_projet_depenses/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models);
  
                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : rubrique dépenses de designation de " + e.data.models[0].designation,
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
                  apiFactory.add("sous_projet_depenses/index",datas, config).success(function (data) {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                        action:"Suppression : rubrique dépenses de designation de " + e.data.models[0].designation,
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
                          designation:      e.data.models[0].designation,
                          montant:       e.data.models[0].montant,
                          pourcentage:       e.data.models[0].pourcentage,
                          id_sous_projet: vm.selectedItemSous_projet.id              
                      });
                  
                  apiFactory.add("sous_projet_depenses/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : rubrique dépenses de designation de " + e.data.models[0].designation,
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
                      designation: {type: "string",validation: {required: true}},
                      montant: {type: "number", validation: {required: true}},
                      pourcentage: {type: "number",validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
              template: '<label id="table_titre">Rubrique dépenses</label>'
              +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
              +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
              +'<md-tooltip><span>Ajout</span></md-tooltip>'
            +'</a>'
            +'<a class="k-button k-button-icontext addoutillageetmateriaux" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sous_projet_depenses\/index\',\'sous_projet_depenses\')">' 
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
              field: "designation",
              title: "Designation",
              width: "Auto"
            },
            {
              field: "montant",
              title: "Montant",
              width: "Auto"
            },
            {
              field: "pourcentage",
              title: "Pourcentage",
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
  
      /* ***************Fin depenses**********************/

  /* ***************Debut indicateurs*********************/

  vm.mainGridOptionsIndicateurs =
  {
    dataSource: new kendo.data.DataSource({
       
      transport:
      {   
        //recuperation ile
          read: function (e)
          { 
            if (vm.selectedItemSous_projet.id)
            {
              apiFactory.getAPIgeneraliserREST("sous_projet_indicateurs/index","menu","getsous_projet_indicateursbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
              {
                  e.success(result.data.response);  
              }, function error(result)
                {
                    vm.showAlert('Erreur','Erreur de lecture');
                });
            }
            else
            {
             e.success('');
            }
          },
          //modification ile
          update : function (e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
              var datas = $.param({
                      supprimer: 0,
                      id:        e.data.models[0].id,      
                      personne:      e.data.models[0].personne,
                      nombre:       e.data.models[0].nombre,
                      id_sous_projet : e.data.models[0].id_sous_projet               
                  });
              apiFactory.add("sous_projet_indicateurs/index",datas, config).success(function (data)
              {                
                e.success(e.data.models);

              /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                          action:"Modification : indicateur sous projet de personne de " + e.data.models[0].personne,
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
            apiFactory.add("sous_projet_indicateurs/index",datas, config).success(function (data) {                
              e.success(e.data.models);
              /***********Debut add historique***********/
              var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              var datas = $.param({
                  action:"Suppression : indicateur sous projet de personne de " + e.data.models[0].personne,
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
                    personne:      e.data.models[0].personne,
                    nombre:       e.data.models[0].nombre,
                    id_sous_projet: vm.selectedItemSous_projet.id              
                });
            
            apiFactory.add("sous_projet_indicateurs/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : indicateur sous projet de personne de " + e.data.models[0].personne,
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
                personne: {type: "string",validation: {required: true}},
                nombre: {type: "number", validation: {required: true}}
              }
          }
      },

      pageSize: 10//nbr affichage
      //serverPaging: true,
      //serverSorting: true
    }),
    
    // height: 550,
    toolbar: [{               
        template: '<label id="table_titre">Indicateurs</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addindicateursousprojet" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sous_projet_indicateurs\/index\',\'sous_projet_indicateurs\')">' 
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
        field: "personne",
        title: "Personne bénéficiaire",
        width: "Auto"
      },
      {
        field: "nombre",
        title: "Nombre",
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

/* ***************Fin indicateurs**********************/

  /* ***************Debut resultats*********************/

  vm.mainGridOptionsResultats =
  {
    dataSource: new kendo.data.DataSource({
       
      transport:
      {   
        //recuperation ile
          read: function (e)
          {
            if (vm.selectedItemSous_projet.id)
            {
              apiFactory.getAPIgeneraliserREST("sous_projet_resultats/index","menu","getsous_projet_resultatsbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
              {
                  e.success(result.data.response);
              }, function error(result)
                {
                    vm.showAlert('Erreur','Erreur de lecture');
                });
            }
            else
            {
             e.success('');
            }
          },
          //modification ile
          update : function (e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
              var datas = $.param({
                      supprimer: 0,
                      id:        e.data.models[0].id,      
                      quantite:      e.data.models[0].quantite,
                      description:       e.data.models[0].description,
                      id_sous_projet : e.data.models[0].id_sous_projet               
                  });
              apiFactory.add("sous_projet_resultats/index",datas, config).success(function (data)
              {                
                e.success(e.data.models);

              /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                          action:"Modification : resultats sous projet de description de " + e.data.models[0].description,
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
            apiFactory.add("sous_projet_resultats/index",datas, config).success(function (data) {                
              e.success(e.data.models);
              /***********Debut add historique***********/
              var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              var datas = $.param({
                  action:"Suppression : resultats sous projet de description de " + e.data.models[0].description,
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
                    quantite:      e.data.models[0].quantite,
                    description:       e.data.models[0].description,
                    id_sous_projet: vm.selectedItemSous_projet.id              
                });
            
            apiFactory.add("sous_projet_resultats/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : resultats sous projet de description de " + e.data.models[0].description,
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
                quantite: {type: "number",validation: {required: true}},
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
        template: '<label id="table_titre">Resultats</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addresultatsousprojet" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sous_projet_resultats\/index\',\'sous_projet_resultats\')">' 
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
        title: "Description",
        width: "Auto"
      },
      {
        field: "quantite",
        title: "Quantite",
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

/* ***************Fin resultats**********************/
  /* ***************Debut Sauvegarde environnementale*********************/
  vm.click_sauvegarde_env = function()
  {
    vm.mainGridOptionsSauvegarde_env.dataSource.read();
  }

  vm.mainGridOptionsSauvegarde_env =
  {
    dataSource: new kendo.data.DataSource({
       
      transport:
      {   
        //recuperation ile
          read: function (e)
          { 
            if (vm.selectedItemSous_projet.id)
            {
                apiFactory.getAPIgeneraliserREST("sauvegarde_env/index","menu","getsauvegarde_envbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
                {
                    e.success(result.data.response);
                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  });
            }
            else
            {
             e.success('');
            }
            
          },
          //modification ile
          update : function (e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
              var datas = $.param({
                      supprimer: 0,
                      id:        e.data.models[0].id,      
                      info_evaluation_pre:      e.data.models[0].info_evaluation_pre,
                      checklist_evaluation_pre:       e.data.models[0].checklist_evaluation_pre,
                      resultats:       e.data.models[0].resultats,
                      methodologie:       e.data.models[0].methodologie,
                      mesures_environnement:       e.data.models[0].mesures_environnement,
                      id_sous_projet : e.data.models[0].id_sous_projet               
                  });
              apiFactory.add("sauvegarde_env/index",datas, config).success(function (data)
              {                
                e.success(e.data.models);

              /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                          action:"Modification : sauvegarde environnementale de mesures environnement de " + e.data.models[0].mesures_environnement,
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
            apiFactory.add("sauvegarde_env/index",datas, config).success(function (data) {                
              e.success(e.data.models);
              /***********Debut add historique***********/
              var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              var datas = $.param({
                  action:"Suppression : sauvegarde environnementale de mesures environnement de " + e.data.models[0].mesures_environnement,
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
                    info_evaluation_pre:      e.data.models[0].info_evaluation_pre,
                    checklist_evaluation_pre:       e.data.models[0].checklist_evaluation_pre,
                    resultats:       e.data.models[0].resultats,
                    methodologie:       e.data.models[0].methodologie,
                    mesures_environnement:       e.data.models[0].mesures_environnement,
                    id_sous_projet: vm.selectedItemSous_projet.id              
                });
            
            apiFactory.add("sauvegarde_env/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : sauvegarde environnementale de mesures environnement de " + e.data.models[0].mesures_environnement,
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
                info_evaluation_pre: {type: "string",validation: {required: true}},
                checklist_evaluation_pre: {type: "string", validation: {required: true}},
                resultats: {type: "string",validation: {required: true}},
                methodologie: {type: "string", validation: {required: true}},
                mesures_environnement: {type: "string", validation: {required: true}}
              }
          }
      },

      pageSize: 10//nbr affichage
      //serverPaging: true,
      //serverSorting: true
    }),
    
    // height: 550,
    toolbar: [{               
        template: '<label id="table_titre">SAUVEGARDE ENVIRONNEMENTALE</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addsauvegarde_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'sauvegarde_env\/index\',\'sauvegarde_env\')">' 
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
        field: "info_evaluation_pre",
        title: "Evaluation préliminaire",
        width: "Auto"
      },
      {
        field: "checklist_evaluation_pre",
        title: "Checklist évaluation préliminaire",
        width: "Auto"
      },
      {
        field: "resultats",
        title: "Resultats",
        width: "Auto"
      },
      {
        field: "methodologie",
        title: "Methodologie",
        width: "Auto"
      },
      {
        field: "mesures_environnement",
        title: "Mesures environnementaux",
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

/* ***************Fin Sauvegarde environnementale**********************/


 /* ***************Debut filtration environnementale*********************/
 vm.click_filtration_env = function()
 {
   //vm.mainGridOptionsFiltration_env.dataSource.read();
   apiFactory.getAPIgeneraliserREST("filtration_env/index","menu","getfiltration_envbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
  {
      vm.allFiltration_env= result.data.response ;
  });
 }
 vm.filtration_env_column =[
  {titre:"Nature sous projet"},
  {titre:"Secretariat"},
  {titre:"Intitule sous projet"},
  {titre:"Type sous projet"},
  {titre:"Localisation"},
  {titre:"Objectif sous projet"},
  {titre:"Activite sous projet"},
  {titre:"Coût estimé sous projet"},
  {titre:"Envergure sous projet"},
  {titre:"Ouvrage prevu"},
  {titre:"Description sous projet"},
  {titre:"Environnement naturel"},
  {titre:"Date visa RT IBD"},
  {titre:"Date visa RES"},
  {titre:"Action"}
  ];
function ajoutFiltration_env(filtration_env,suppression)
{
            	
    if (NouvelItemFiltration_env==false) 
    {
        test_existenceFiltration_env (filtration_env,suppression); 
    }
    else
    {
        insert_in_baseFiltration_env(filtration_env,suppression);
    }

}

function insert_in_baseFiltration_env(entite,suppression)
{  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemFiltration_env==false)
      {
			   getId = vm.selectedItemFiltration_env.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				nature_sous_projet: entite.nature_sous_projet,      
				secretariat: entite.secretariat,      
				intitule_sous_projet: entite.intitule_sous_projet,
				type_sous_projet: entite.type_sous_projet,      
				localisation: entite.localisation,      
				objectif_sous_projet: entite.objectif_sous_projet,       
				activite_sous_projet: entite.activite_sous_projet,      
				cout_estime_sous_projet: entite.cout_estime_sous_projet,      
				envergure_sous_projet: entite.envergure_sous_projet,      
				ouvrage_prevu: entite.ouvrage_prevu,      
				description_sous_projet: entite.description_sous_projet,      
				environnement_naturel: entite.environnement_naturel,      
				date_visa_rt_ibd: convertionDate(entite.date_visa_rt_ibd),     
				date_visa_res: convertionDate(entite.date_visa_res),      
				id_sous_projet: vm.selectedItemSous_projet.id
			});       
			//factory
			apiFactory.add("filtration_env/index",datas, config).success(function (data)
			{
				if (NouvelItemFiltration_env == false)
        {
					// Update or delete: id exclu                   
					if(suppression==0)
          {
					   vm.selectedItemFiltration_env.nature_sous_projet = entite.nature_sous_projet;
					  vm.selectedItemFiltration_env.secretariat         = entite.secretariat;
					  vm.selectedItemFiltration_env.intitule_sous_projet = entite.intitule_sous_projet;
					  vm.selectedItemFiltration_env.type_sous_projet     = entite.type_sous_projet;
					  vm.selectedItemFiltration_env.localisation         = entite.localisation;      
            vm.selectedItemFiltration_env.objectif_sous_projet = entite.objectif_sous_projet;       
            vm.selectedItemFiltration_env.activite_sous_projet = entite.activite_sous_projet;      
            vm.selectedItemFiltration_env.cout_estime_sous_projet = entite.cout_estime_sous_projet;      
            vm.selectedItemFiltration_env.envergure_sous_projet   = entite.envergure_sous_projet;      
            vm.selectedItemFiltration_env.ouvrage_prevu           = entite.ouvrage_prevu;      
            vm.selectedItemFiltration_env.description_sous_projet = entite.description_sous_projet;      
            vm.selectedItemFiltration_env.environnement_naturel   = entite.environnement_naturel;      
            vm.selectedItemFiltration_env.date_visa_rt_ibd        = entite.date_visa_rt_ibd;     
            vm.selectedItemFiltration_env.date_visa_res           = entite.date_visa_res;
					  vm.selectedItemFiltration_env.$selected = false;
					  vm.selectedItemFiltration_env.$edit = false;
					  vm.selectedItemFiltration_env ={};
					} else {    
						vm.allFiltration_env = vm.allFiltration_env.filter(function(obj) {
							return obj.id !== vm.selectedItemFiltration_env.id;
						});
					}
				} else {
					entite.id=data.response;	
					NouvelItemFiltration_env=false;
				}
				entite.$selected=false;
				entite.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionFiltration_env= function (item) {     
            vm.selectedItemFiltration_env = item;
        };
        $scope.$watch('vm.selectedItemFiltration_env', function()
        {
          if (!vm.allFiltration_env) return;
          vm.allFiltration_env.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selectedItemFiltration_env.$selected = true;
      });
        vm.ajouterFiltration_env = function ()
        {
            vm.selectedItemFiltration_env.$selected = false;
            NouvelItemFiltration_env = true ;
            var items =
            {
                $edit: true,
                $selected: true,
                supprimer:0,
                id: '0',
                nature_sous_projet: '',
                secretariat: '',
                intitule_sous_projet: '',
                type_sous_projet: '',
                localisation: '',     
                objectif_sous_projet: '',       
                activite_sous_projet:'',      
                cout_estime_sous_projet: '',      
                envergure_sous_projet: '',      
                ouvrage_prevu: '',      
                description_sous_projet: '',      
                environnement_naturel: '',      
                date_visa_rt_ibd: '',     
                date_visa_res: ''
            };
			    vm.allFiltration_env.unshift(items);

          vm.allFiltration_env.forEach(function(it)
          {
              if(it.$selected==true)
              {
                vm.selectedItemFiltration_env = it;
              }
          });			
        };
        vm.annulerFiltration_env= function(item)
        { 
          if (NouvelItemFiltration_env == false)
          {
            item.$selected=false;
            item.$edit=false;
            NouvelItemFiltration_env = false;
            item.nature_sous_projet   = currentItemFiltration_env.nature_sous_projet;
            item.secretariat          = currentItemFiltration_env.secretariat;
            item.intitule_sous_projet = currentItemFiltration_env.intitule_sous_projet;
            item.type_sous_projet     = currentItemFiltration_env.type_sous_projet;
            item.localisation         = currentItemFiltration_env.localisation;      
            item.objectif_sous_projet = currentItemFiltration_env.objectif_sous_projet;       
            item.activite_sous_projet = currentItemFiltration_env.activite_sous_projet;      
            item.cout_estime_sous_projet = currentItemFiltration_env.cout_estime_sous_projet;      
            item.envergure_sous_projet   = currentItemFiltration_env.envergure_sous_projet;      
            item.ouvrage_prevu           = currentItemFiltration_env.ouvrage_prevu;      
            item.description_sous_projet = currentItemFiltration_env.description_sous_projet;      
            item.environnement_naturel   = currentItemFiltration_env.environnement_naturel;      
            item.date_visa_rt_ibd        = currentItemFiltration_env.date_visa_rt_ibd;     
            item.date_visa_res           = currentItemFiltration_env.date_visa_res;
          }
          else
          {
            vm.allFiltration_env = vm.allFiltration_env.filter(function(obj) {
              return obj.id !== vm.selectedItemFiltration_env.id;
            });
          }  
       };
        vm.modifierFiltration_env = function(item)
        {
          NouvelItemFiltration_env = false ;
          vm.selectedItemFiltration_env = item;			
          currentItemFiltration_env = angular.copy(vm.selectedItemFiltration_env);
          $scope.vm.allFiltration_env.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
          item.nature_sous_projet   = vm.selectedItemFiltration_env.nature_sous_projet;
          item.secretariat          = vm.selectedItemFiltration_env.secretariat;
          item.intitule_sous_projet = vm.selectedItemFiltration_env.intitule_sous_projet;
          item.type_sous_projet     = vm.selectedItemFiltration_env.type_sous_projet;
          item.localisation         = vm.selectedItemFiltration_env.localisation;     
          item.objectif_sous_projet = vm.selectedItemFiltration_env.objectif_sous_projet;       
          item.activite_sous_projet = vm.selectedItemFiltration_env.activite_sous_projet;      
          item.cout_estime_sous_projet = parseFloat(vm.selectedItemFiltration_env.cout_estime_sous_projet);      
          item.envergure_sous_projet   = vm.selectedItemFiltration_env.envergure_sous_projet;      
          item.ouvrage_prevu           = vm.selectedItemFiltration_env.ouvrage_prevu;      
          item.description_sous_projet = vm.selectedItemFiltration_env.description_sous_projet;      
          item.environnement_naturel   = vm.selectedItemFiltration_env.environnement_naturel;      
          item.date_visa_rt_ibd        = vm.selectedItemFiltration_env.date_visa_rt_ibd;     
          item.date_visa_res           = vm.selectedItemFiltration_env.date_visa_res;
          
          vm.selectedItemFiltration_env.$edit = true;	
        };
        vm.supprimerFiltration_env = function()
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('supprimer')
                    .cancel('annuler');
          $mdDialog.show(confirm).then(function()
          {          
            ajoutFiltration_env(vm.selectedItemFiltration_env,1);
          }, function() {
          });
        }
        function test_existenceFiltration_env (item,suppression)
        {
          if (suppression!=1) 
          {
              var ag = vm.allFiltration_env.filter(function(obj)
              {
                  return obj.id == currentItemFiltration_env.id;
              });
              if(ag[0])
              {
                  if((ag[0].nature_sous_projet            !=currentItemFiltration_env.nature_sous_projet)
                            ||(ag[0].secretariat          !=currentItemFiltration_env.secretariat)
                            ||(ag[0].intitule_sous_projet !=currentItemFiltration_env.intitule_sous_projet)
                            ||(ag[0].type_sous_projet     !=currentItemFiltration_env.type_sous_projet)
                            ||(ag[0].localisation         !=currentItemFiltration_env.localisation)                                 
                            ||(ag[0].objectif_sous_projet != currentItemFiltration_env.objectif_sous_projet)       
                            ||(ag[0].activite_sous_projet != currentItemFiltration_env.activite_sous_projet)      
                            ||(ag[0].cout_estime_sous_projet != currentItemFiltration_env.cout_estime_sous_projet)      
                            ||(ag[0].envergure_sous_projet   != currentItemFiltration_env.envergure_sous_projet)      
                            ||(ag[0].ouvrage_prevu           != currentItemFiltration_env.ouvrage_prevu)      
                            ||(ag[0].description_sous_projet != currentItemFiltration_env.description_sous_projet)      
                            ||(ag[0].environnement_naturel   != currentItemFiltration_env.environnement_naturel)      
                            ||(ag[0].date_visa_rt_ibd        != currentItemFiltration_env.date_visa_rt_ibd)     
                            ||(ag[0].date_visa_res           != currentItemFiltration_env.date_visa_res))                    
                  { 
                      insert_in_baseFiltration_env(item,suppression);
                  }
                  else
                  {
                      item.$selected=false;
                      item.$edit=false;
                  }                    
              }
            }
              else
                  insert_in_baseFiltration_env(item,suppression);			
        }
  
/* ***************Fin Filtration environnementale**********************/

/* ***************Debut Aspect et problème environnementale**********************/

vm.click_Aspetsetproblemes_env = function()
 {
   vm.mainGridOptionsAspects_env.dataSource.read();
 }
vm.mainGridOptionsAspects_env =
 {
   dataSource: new kendo.data.DataSource({
      
     transport:
     {   
       //recuperation ile
         read: function (e)
         { 
           if (vm.selectedItemSous_projet.id)
           {
               apiFactory.getAPIgeneraliserREST("aspects_env/index","menu","getaspects_envbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result)
               {
                   e.success(result.data.response);
               }, function error(result)
                 {
                     vm.showAlert('Erreur','Erreur de lecture');
                 });
           }
           else
           {
            e.success('');
           }
           
         },
         //modification ile
         update : function (e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
           
             var datas = $.param({
                     supprimer: 0,
                     id:        e.data.models[0].id,   
                     type_sous_projet:      e.data.models[0].type_sous_projet,  
                     emplace_site:      e.data.models[0].emplace_site,
                    etat_initial_recepteur:       e.data.models[0].etat_initial_recepteur,
                    classification_sous_projet:       e.data.models[0].classification_sous_projet,
                     id_sous_projet : e.data.models[0].id_sous_projet               
                 });
                 console.log(datas);
             apiFactory.add("aspects_env/index",datas, config).success(function (data)
             {                
               e.success(e.data.models);

            
                 var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 var datas = $.param({
                         action:"Modification : aspectsetproblemes environnementale de intitule sous projet de " + e.data.models[0].etat_initial_recepteur,
                         id_utilisateur:vm.id_utilisateur
                 });
                       
                 apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                 });
            

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
           apiFactory.add("aspects_env/index",datas, config).success(function (data) {                
             e.success(e.data.models);
             var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             var datas = $.param({
                 action:"Suppression : aspectsetproblemes environnementale de intitule sous projet de " + e.data.models[0].etat_initial_recepteur,
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
         //creation ile
         create: function(e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             
           var datas = $.param({
                   supprimer: 0,
                   id:        0,    
                   type_sous_projet:      e.data.models[0].type_sous_projet,  
                   emplace_site:      e.data.models[0].emplace_site,
                  etat_initial_recepteur:       e.data.models[0].etat_initial_recepteur,
                  classification_sous_projet:       e.data.models[0].classification_sous_projet,
                   id_sous_projet: vm.selectedItemSous_projet.id              
               });
           
           apiFactory.add("aspects_env/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet=vm.selectedItemSous_projet.id;                                 
               e.success(e.data.models);

               var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
               var datas = $.param({
                       action:"Creation : aspects environnementale de intitule sous projet de " + e.data.models[0].etat_initial_recepteur,
                       id_utilisateur:vm.id_utilisateur
               });
                     
               apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
               });
          

           }).error(function (data)
             {
               vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
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
              type_sous_projet: {type: "string",validation: {required: true}},
              emplace_site: {type: "string", validation: {required: true}},
              etat_initial_recepteur: {type: "string",validation: {required: true}},
              classification_sous_projet: {type: "string",validation: {required: true}}
             }
         }
     },

     pageSize: 10//nbr affichage
     //serverPaging: true,
     //serverSorting: true
   }),
   
   // height: 550,
   toolbar: [{               
       template: '<label id="table_titre">ASPECTS ENVIRONNEMENTALE</label>'
       +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
       +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
       +'<md-tooltip><span>Ajout</span></md-tooltip>'
     +'</a>'
     +'<a class="k-button k-button-icontext addfiltration_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'aspects_env\/index\',\'aspects_env\')">' 
       +'<md-icon md-font-icon="icon-box-download"></md-icon>'
       +'<md-tooltip><span>Download</span></md-tooltip>'
     +'</a>'
   }],
   editable:{ mode:"inline",update: true,destroy: true},
   //selectable:"row",
   sortable: false,
   //pageable: true,
   reorderable: true,
   scrollable: false,              
   filterable: false,
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
       field: "type_sous_projet",
       title: "Type sous projet",
       width: "Auto"
     },
     {
       field: "emplace_site",
       title: "Emplacement site de construction",
       width: "Auto"
     },
     {
       field: "etat_initial_recepteur",
       title: "Déscription etat initial récepteur",
       width: "Auto"
     },
     {
       field: "classification_sous_projet",
       title: "classification sous projet",
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

/* ***************Fin Aspect environnementale**********************/
/* ***************Debut problème environnementale**********************/

vm.allproblemes_env = function(aspects_env_id) {
  return {
    dataSource:
    {
      type: "json",
      transport: {
        //recuperation district
        read: function (e)
        { 
          if (vm.selectedItemSous_projet.id)
          {
            apiFactory.getAPIgeneraliserREST("problemes_env/index","menu","getproblemes_envbyaspects","id_aspects_env",aspects_env_id).then(function(result)
            {
                e.success(result.data.response);
  
            }, function error(result)
              {
                  vm.showAlert('Erreur','Erreur de lecture');
              });
            
          }
          else
          {
           e.success('');
          }
        },
        //modification district
        update : function (e)
        {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
          
            var datas = $.param({
                    supprimer: 0,
                    id:        e.data.models[0].id,      
                    description:      e.data.models[0].description,
                    libelle:       e.data.models[0].libelle,
                    id_aspects_env: aspects_env_id               
                });
            apiFactory.add("problemes_env/index",datas, config).success(function (data)
            {                
              e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Modification : problemes environnementaux de libelle de " + e.data.models[0].libelle,
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
      apiFactory.add("problemes_env/index",datas, config).success(function (data) {                
        e.success(e.data.models);
        /***********Debut add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
            action:"Suppression : problemes environnementaux de libelle de " + e.data.models[0].libelle,
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
                    description:      e.data.models[0].description,
                    libelle:       e.data.models[0].libelle,
                    id_aspects_env: aspects_env_id               
                });
            
            apiFactory.add("problemes_env/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_aspects_env=aspects_env_id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : problemes environnementaux de libelle de " + e.data.models[0].libelle,
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
                  description: {type: "string",validation: {required: true}},
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
         template: '<label id="table_titre">PROBLEMES ENVIRONNEMENTAUX</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addproblemes_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'problemes_env\/index\',\'problemes_env\')">' 
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
        field: "libelle",
        title: "Libelle",
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

/* ***************Fin probleme environnementale**********************/
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
vm.formatDate = function (daty)
{
  if (daty) 
  {
    var date  = new Date(daty);
    var mois  = date.getMonth()+1;
    var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
    return dates;
  }            

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

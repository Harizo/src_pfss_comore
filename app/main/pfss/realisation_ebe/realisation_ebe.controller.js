(function ()
{
    'use strict';

    angular
        .module('app.pfss.realisation_ebe')
        .controller('Realisation_ebeController', Realisation_ebeController);

    /** @ngInject */
    function Realisation_ebeController(apiFactory, $scope, $mdDialog,$state)
    {
        //console.log(type_sous_projet);
    	var vm = this ;
        vm.date_now = new Date();
        var id_sous_projet_state = $state.current.id_sous_projet;
        vm.type_sous_projet = $state.current.type_sous_projet;
    	vm.selectedItemRealisation_ebe = {};
		var NouvelItemRealisation_ebe=false;
        var currentItemRealisation_ebe;

        vm.allRealisation_ebe = [];
        vm.formation_ml = {};

        vm.selectedItemTheme_formation_ebe = {} ;
        var current_selectedItemTheme_formation_ebe = {} ;
        vm.nouvelItemTheme_formation_ebe = false ;
        vm.allTheme_formation_ebe = [] ;
        vm.affiche_load = false ;

        
        vm.selectedItemGroupe_participant_ebe = {} ;
        var current_selectedItemGroupe_participant_ebe = {} ;
        vm.nouvelItemGroupe_participant_ebe = false ;
        vm.allGroupe_participant_ebe = [];

        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

        apiFactory.getAPIgeneraliserREST("contrat_ugp_agex/index",'id_sous_projet',id_sous_projet_state).then(function(result)
        {
            vm.allContrat_agex = result.data.response;
        });
       /* apiFactory.getAPIgeneraliserREST("contrat_agex/index","menu","getcontratbysousprojet",'id_sous_projet',id_sous_projet_state).then(function(result)
        {
            vm.allContrat_agex = result.data.response;
        });*/

        apiFactory.getAll("Ile/index").then(function(result)
        {
            vm.all_ile = result.data.response;
        });

        vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ;  
          vm.filtre.id_village = null ;  
          vm.filtre.id_zip = null ;  
          vm.filtre.vague = null ; 
          vm.filtre.id_groupe_ml_pl = null ; 
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.id_village = null ; 
          vm.filtre.id_zip = null ;  
          vm.filtre.vague = null ;  
          vm.filtre.id_groupe_ml_pl = null ;           
        });
      }
      
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;  
          vm.filtre.id_zip = null ; 
          vm.filtre.vague = null ;   
          vm.filtre.id_groupe_ml_pl = null ;          
        });
      }
      vm.filtre_zip_groupe = function()
        {
          vm.allZip=[];
          var vil = vm.all_village.filter(function(obj)
          {
            return obj.id == vm.filtre.id_village;
          });
		  if (vil.length!=0)
		  {
			  if (vil[0].vague)
			  {
				vm.filtre.vague = vil[0].vague;
			  }
			  else
			  {
				vm.filtre.vague = null ; 
			  }
			  if (vil[0].zip)
			  {
				apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
					vm.allZip.push(result.data.response);
					
					if (result.data.response)
					{
					  vm.filtre.id_zip = result.data.response.id;
					}
					else
					{
						vm.filtre.id_zip = null;
					}
					
				  });
			  }
			  else
			  {
				vm.filtre.id_zip = null ; 
			  }

		  }
		  else
		  {
			vm.filtre.id_zip = null;
			vm.filtre.vague = null ; 
		  }
          
        
        apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.filtre.id_village).then(function(result)
        { 
            vm.allGroupe_ml_pl = result.data.response;   
            vm.filtre.id_groupe_ml_pl = null ;            
        });
        }
        
        vm.filtre_menage = function()
        {
            apiFactory.getAPIgeneraliserREST("menage/index","id_groupe_ml_pl",vm.filtre.id_groupe_ml_pl).then(function(result)
            { 
                vm.allMenage = result.data.response; 
                console.log(vm.allMenage);           
            });
        }
      
      vm.get_realisation_ebe = function()
      {
          apiFactory.getAPIgeneraliserREST("realisation_ebe/index","menu","getrealisation_ebeBysousprojetml_pl",'id_sous_projet',id_sous_projet_state,
          "id_groupe_ml_pl",vm.filtre.id_groupe_ml_pl).then(function(result) { 
              vm.allRealisation_ebe = result.data.response;
              console.log(vm.allRealisation_ebe);
          });           
          vm.selectedItemRealisation_ebe ={};
      }
            vm.realisation_ebe_column = 
            [   
                {titre:"Contrat ONG N°"},
                {titre:"Rencontre N°:"},
                {titre:"But regroupement"},
                {titre:"Date regroupement"},
                {titre:"Matériels"},
                {titre:"Lieu"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemRealisation_ebe = item ;
                console.log(vm.selectedItemRealisation_ebe);
            }

            $scope.$watch('vm.selectedItemRealisation_ebe', function() {
                if (!vm.allRealisation_ebe) return;
                vm.allRealisation_ebe.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemRealisation_ebe.$selected = true;
            });

            vm.ajoutRealisation_ebe = function(realisation_ebe,suppression)
            {
                if (NouvelItemRealisation_ebe==false)
                {
                    test_existenceRealisation_ebe(realisation_ebe,suppression); 
                }
                else
                {
                    insert_in_baseRealisation_ebe(realisation_ebe,suppression);
                }
            }
            vm.ajouterRealisation_ebe = function ()
            {
                vm.selectedItemRealisation_ebe.$selected = false;
                NouvelItemRealisation_ebe = true ;
                vm.realisation_ebe.supprimer=0;
                vm.realisation_ebe.id=0;
                vm.realisation_ebe.numero=null;
                vm.realisation_ebe.but_regroupement=null;
                vm.realisation_ebe.date_regroupement=null;
                vm.realisation_ebe.materiel=null;
                vm.realisation_ebe.lieu=null;
                vm.realisation_ebe.id_contrat_agex=null;
                vm.realisation_ebe.id_groupe_ml_pl= vm.filtre.id_groupe_ml_pl;
                //vm.formation_ml.id_commune=null;		
                vm.affichage_masque=true;
                vm.selectedItemRealisation_ebe = {};
            }
            vm.annulerRealisation_ebe = function(item)
            {
                vm.selectedItemRealisation_ebe={};
                vm.selectedItemRealisation_ebe.$selected = false;
                NouvelItemRealisation_ebe = false;
                vm.affichage_masque=false;
                vm.realisation_ebe = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifRealisation_ebe = function () 
            {
                NouvelItemRealisation_ebe = false;                
                currentItemRealisation_ebe = JSON.parse(JSON.stringify(vm.selectedItemRealisation_ebe));
                vm.realisation_ebe.numero  = parseInt(vm.selectedItemRealisation_ebe.numero) ;
                vm.realisation_ebe.but_regroupement   = vm.selectedItemRealisation_ebe.but_regroupement ;
                vm.realisation_ebe.date_regroupement   = new Date(vm.selectedItemRealisation_ebe.date_regroupement) ;
                vm.realisation_ebe.materiel = vm.selectedItemRealisation_ebe.materiel ;
                vm.realisation_ebe.lieu = vm.selectedItemRealisation_ebe.lieu ;
                vm.realisation_ebe.id_groupe_ml_pl  = vm.selectedItemRealisation_ebe.id_groupe_ml_pl ;

                var contrat = vm.allContrat_agex.filter(function(obj)
                {
                    return obj.id == vm.selectedItemRealisation_ebe.contrat_agex.id ;
                 });
                 if (contrat.length!=0)
                 {
                    vm.realisation_ebe.id_contrat_agex  = contrat[0].id ;                     
                 }
                vm.affichage_masque=true;
            }

            vm.supprimerRealisation_ebe = function()
            {
                vm.affichage_masque = false ;
                
                var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('ok')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {

                    insert_in_baseRealisation_ebe(vm.selectedItemRealisation_ebe,1);
                }, function() {
                });
            }

            function insert_in_baseRealisation_ebe (realisation_ebe, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemRealisation_ebe) 
                    {
                        id = vm.selectedItemRealisation_ebe.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:          etat_suppression,
                        numero:             realisation_ebe.numero,
                        but_regroupement:   realisation_ebe.but_regroupement,
                        date_regroupement:  convert_date(realisation_ebe.date_regroupement),
                        materiel:           realisation_ebe.materiel,
                        lieu:               realisation_ebe.lieu,
                        id_contrat_agex:  realisation_ebe.id_contrat_agex,
                        id_groupe_ml_pl:           vm.filtre.id_groupe_ml_pl            
                        
                    });

                    apiFactory.add("realisation_ebe/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemRealisation_ebe) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var contrat = vm.allContrat_agex.filter(function(obj)
                                {
                                    return obj.id == realisation_ebe.id_contrat_agex  ;
                                });
                                if (contrat.length!=0)
                                {                                  
                                    vm.selectedItemRealisation_ebe.contrat_agex = contrat[0] ;  
                                }
                                vm.selectedItemRealisation_ebe.id_groupe_ml_pl         = realisation_ebe.id_groupe_ml_pl ;
                                vm.selectedItemRealisation_ebe.numero           = realisation_ebe.numero ;
                                vm.selectedItemRealisation_ebe.but_regroupement = realisation_ebe.but_regroupement ;
                                vm.selectedItemRealisation_ebe.date_regroupement = new Date(realisation_ebe.date_regroupement) ;
                                vm.selectedItemRealisation_ebe.materiel         = realisation_ebe.materiel ;
                                vm.selectedItemRealisation_ebe.lieu             = realisation_ebe.lieu ;                              
                            }
                            else
                            {
                                vm.allRealisation_ebe = vm.allRealisation_ebe.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemRealisation_ebe.id ;
                                });
                            }

                        }
                        else
                        {   var cont = [];
                            var contrat = vm.allContrat_agex.filter(function(obj)
                            {
                                return obj.id == realisation_ebe.id_contrat_agex  ;
                            });
                            if (contrat.length!=0)
                            {                                  
                                cont = contrat[0] ;  
                            }
                            var item =
                            {
                            id :                        String(data.response) ,
                            contrat_agex :    cont ,
                            id_commune :                realisation_ebe.id_commune ,
                            numero :                    realisation_ebe.numero ,
                            but_regroupement :          realisation_ebe.but_regroupement ,
                            date_regroupement :         new Date(realisation_ebe.date_regroupement) ,
                            materiel :                  realisation_ebe.materiel ,
                            lieu :                      realisation_ebe.lieu ,
                            id_groupe_ml_pl :                  realisation_ebe.id_groupe_ml_pl 
                            }
                            vm.allRealisation_ebe.unshift(item) ;
					        
                        }
                        NouvelItemRealisation_ebe = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.realisation_ebe = {};
                        vm.selectedItemRealisation_ebe ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceRealisation_ebe (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemRealisation_ebe.numero                 != item.numero )
                        ||(currentItemRealisation_ebe.but_regroupement    != item.but_regroupement )
                        ||(currentItemRealisation_ebe.date_regroupement   != convert_date(item.date_regroupement) )
                        ||(currentItemRealisation_ebe.materiel            != item.materiel )
                        ||(currentItemRealisation_ebe.lieu                != item.lieu )
                        ||(currentItemRealisation_ebe.contrat_agex.id   != item.id_contrat_agex ) 
                        )                    
                    { 
                            insert_in_baseRealisation_ebe(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseRealisation_ebe(item,suppression);		
            }
        //Realisation ebe fin

        //ETAT PAIEMENT
       
            
            vm.click_theme_formation_ebe = function () 
            {
                vm.affiche_load = true ;
               apiFactory.getAPIgeneraliserREST("theme_formation_ebe/index","cle_etrangere",vm.selectedItemRealisation_ebe.id).then(function(result){
                    vm.allTheme_formation_ebe = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allTheme_formation_ebe);
                }); 
                vm.selectedItemTheme_formation_ebe = {}; 
            }
        
            vm.theme_formation_ebe_column =[  
                                        {titre:"Theme de sensibilisation"},
                                        {titre:"Activite"}
                                    ];

                vm.selectionTheme_formation_ebe = function(item)
                {
                    vm.selectedItemTheme_formation_ebe = item ;

                    if (!vm.selectedItemTheme_formation_ebe.$edit) 
                    {
                        vm.nouvelItemTheme_formation_ebe = false ;  

                    }

                }

                $scope.$watch('vm.selectedItemTheme_formation_ebe', function()
                {
                    if (!vm.allTheme_formation_ebe) return;
                    vm.allTheme_formation_ebe.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemTheme_formation_ebe.$selected = true;

                });
               
                vm.ajouterTheme_formation_ebe = function()
                {
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            theme_sensibilisation : null,
                            activite : null
                        } ;

                    vm.nouvelItemTheme_formation_ebe = true ;                    

                    vm.allTheme_formation_ebe.unshift(item);
                    vm.allTheme_formation_ebe.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemTheme_formation_ebe = af;
                        
                      }
                    });
                }

                vm.modifierTheme_formation_ebe = function()
                {
                    vm.nouvelItemTheme_formation_ebe = false ;
                    vm.selectedItemTheme_formation_ebe.$edit = true;
                
                    current_selectedItemTheme_formation_ebe = angular.copy(vm.selectedItemTheme_formation_ebe);
                    vm.selectedItemTheme_formation_ebe.activite = vm.selectedItemTheme_formation_ebe.activite ;
                    vm.selectedItemTheme_formation_ebe.theme_sensibilisation = vm.selectedItemTheme_formation_ebe.theme_sensibilisation  ;                   
                }

                vm.supprimerTheme_formation_ebe = function()
                {

                    
                    var confirm = $mdDialog.confirm()
                      .title('Etes-vous sûr de supprimer cet enregistrement ?')
                      .textContent('Cliquer sur OK pour confirmer')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('OK')
                      .cancel('Annuler');
                    $mdDialog.show(confirm).then(function() {

                    vm.enregistrerTheme_formation_ebe(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annulerTheme_formation_ebe = function()
                {
                    if (vm.nouvelItemTheme_formation_ebe) 
                    {
                        
                        vm.allTheme_formation_ebe.shift();
                        vm.selectedItemTheme_formation_ebe = {} ;
                        vm.nouvelItemTheme_formation_ebe = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemTheme_formation_ebe.$edit) //annuler selection
                        {
                            vm.selectedItemTheme_formation_ebe.$selected = false;
                            vm.selectedItemTheme_formation_ebe = {};
                        }
                        else
                        {
                            vm.selectedItemTheme_formation_ebe.$selected = false;
                            vm.selectedItemTheme_formation_ebe.$edit = false;
                            vm.selectedItemTheme_formation_ebe.activite = current_selectedItemTheme_formation_ebe.activite ;
                            vm.selectedItemTheme_formation_ebe.theme_sensibilisation = current_selectedItemTheme_formation_ebe.theme_sensibilisation ;
                            
                            vm.selectedItemTheme_formation_ebe = {};
                        }

                        

                    }
                }

                vm.enregistrerTheme_formation_ebe = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };
                    var id_formation = vm.selectedItemRealisation_ebe.id;
                    if (vm.nouvelItemTheme_formation_ebe==false)
                    {
                        id_formation = vm.selectedItemTheme_formation_ebe.id_realisation_ebe;
                    }

                    var datas = $.param(
                    {                        
                        supprimer:etat_suppression,
                        id: vm.selectedItemTheme_formation_ebe.id,
                        activite: vm.selectedItemTheme_formation_ebe.activite,  
                        theme_sensibilisation: vm.selectedItemTheme_formation_ebe.theme_sensibilisation,
                        id_realisation_ebe : id_formation 
                    });
                    console.log(datas);
                    apiFactory.add("theme_formation_ebe/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                      
                        if (!vm.nouvelItemTheme_formation_ebe) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                vm.selectedItemTheme_formation_ebe.$edit = false ;
                                vm.selectedItemTheme_formation_ebe.$selected = false ;
                                vm.selectedItemTheme_formation_ebe = {} ;
                            }
                            else
                            {
                                vm.allTheme_formation_ebe = vm.allTheme_formation_ebe.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemTheme_formation_ebe.id;
                                });

                                vm.selectedItemTheme_formation_ebe = {} ;
                            }

                        }
                        else
                        {   
                            vm.selectedItemTheme_formation_ebe.$edit = false ;
                            vm.selectedItemTheme_formation_ebe.$selected = false ;
                            vm.selectedItemTheme_formation_ebe.id = String(data.response) ;
                            vm.selectedItemTheme_formation_ebe.id_realisation_ebe = id_formation;

                            vm.nouvelItemTheme_formation_ebe = false ;
                            vm.selectedItemTheme_formation_ebe = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            vm.formatMillier = function (nombre) 
            {
                if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                    nombre += '';
                    var sep = ' ';
                    var reg = /(\d+)(\d{3})/;
                    while (reg.test(nombre)) {
                        nombre = nombre.replace(reg, '$1' + sep + '$2');
                    }
                    return nombre;
                } else {
                    return "";
                }
            }

            function convert_date(date)
            {   
                if(date)
                {
                    var d     = new Date(date);
                    var jour  = d.getDate();
                    var mois  = d.getMonth()+1;
                    var annee = d.getFullYear();
                    if(mois <10)
                    {
                        mois = '0' + mois;
                    }
                    if(jour <10)
                    {
                        jour = '0' + jour;
                    }
                    var date_final= annee+"-"+mois+"-"+jour;
                    return date_final
                }      
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

            //fin Etat_paiement..

            //Debut liste groupe participant
            
            vm.click_groupe_participant_ebe = function () 
            {
                vm.affiche_load = true ;
               apiFactory.getAPIgeneraliserREST("participant_realisation_ebe/index","cle_etrangere",vm.selectedItemRealisation_ebe.id).then(function(result){
                    vm.allGroupe_participant_ebe = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allGroupe_participant_ebe);
                }); 
                vm.selectedItemGroupe_participant_ebe = {}; 
                /*apiFactory.getAPIgeneraliserREST("menage/index","id_groupe_ml_pl",vm.filtre.id_groupe_ml_pl).then(function(result)
                { 
                vm.allMenage = result.data.response;            
                });*/
            }
            
           /* vm.filtre_groupe_ml = function(village_id)
            {
                apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",village_id).then(function(result)
                { 
                vm.allGroupe_ml_pl = result.data.response;            
                });
            }*/
            vm.change_menage = function(item)
            {
                var gr = vm.allMenage.filter(function(obj)
                {
                    return obj.id == item.id_menage;
                });
                console.log(gr);
                item.Addresse = gr[0].Addresse;
                item.telephone_chef_menage = gr[0].telephone_chef_menage;
            }
            vm.groupe_participant_ebe_column =[  
                                        {titre:"Ménage"},
                                        {titre:"Adresse"},
                                        {titre:"Téléphone"}
                                    ];

                vm.selectionGroupe_participant_ebe = function(item)
                {
                    vm.selectedItemGroupe_participant_ebe = item ;

                    if (!vm.selectedItemGroupe_participant_ebe.$edit) 
                    {
                        vm.nouvelItemGroupe_participant_ebe = false ;  

                    }

                }

                $scope.$watch('vm.selectedItemGroupe_participant_ebe', function()
                {
                    if (!vm.allGroupe_participant_ebe) return;
                    vm.allGroupe_participant_ebe.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemGroupe_participant_ebe.$selected = true;

                });
               
                vm.ajouterGroupe_participant_ebe = function()
                {
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_menage : null,
                            Addresse : null,
                            telephone_chef_menage : null
                        } ;

                    vm.nouvelItemGroupe_participant_ebe = true ;                    

                    vm.allGroupe_participant_ebe.unshift(item);
                    vm.allGroupe_participant_ebe.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemGroupe_participant_ebe = af;
                        
                      }
                    });
                }

                vm.modifierGroupe_participant_ebe = function()
                {
                    vm.nouvelItemGroupe_participant_ebe = false ;
                    vm.selectedItemGroupe_participant_ebe.$edit = true;
                
                    current_selectedItemGroupe_participant_ebe = angular.copy(vm.selectedItemGroupe_participant_ebe);
                    vm.selectedItemGroupe_participant_ebe.id_menage = vm.selectedItemGroupe_participant_ebe.menage.id;
                    vm.selectedItemGroupe_participant_ebe.Addresse = vm.selectedItemGroupe_participant_ebe.menage.Addresse;
                    vm.selectedItemGroupe_participant_ebe.telephone_chef_menage = vm.selectedItemGroupe_participant_ebe.menage.telephone_chef_menage;
                                     
                }

                vm.supprimerGroupe_participant_ebe = function()
                {
                    
                    var confirm = $mdDialog.confirm()
                      .title('Etes-vous sûr de supprimer cet enregistrement ?')
                      .textContent('Cliquer sur OK pour confirmer')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('OK')
                      .cancel('Annuler');
                    $mdDialog.show(confirm).then(function() {

                    vm.enregistrerGroupe_participant_ebe(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annulerGroupe_participant_ebe = function()
                {
                    if (vm.nouvelItemGroupe_participant_ebe) 
                    {
                        
                        vm.allGroupe_participant_ebe.shift();
                        vm.selectedItemGroupe_participant_ebe = {} ;
                        vm.nouvelItemGroupe_participant_ebe = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemGroupe_participant_ebe.$edit) //annuler selection
                        {
                            vm.selectedItemGroupe_participant_ebe.$selected = false;
                            vm.selectedItemGroupe_participant_ebe = {};
                        }
                        else
                        {
                            vm.selectedItemGroupe_participant_ebe.$selected = false;
                            vm.selectedItemGroupe_participant_ebe.$edit = false;
                            vm.selectedItemGroupe_participant_ebe.menage = current_selectedItemGroupe_participant_ebe.menage ;
                            
                            vm.selectedItemGroupe_participant_ebe = {};
                        }

                        

                    }
                }

                vm.enregistrerGroupe_participant_ebe = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };
                    var id_formation = vm.selectedItemRealisation_ebe.id;
                    if (vm.nouvelItemGroupe_participant_ebe==false)
                    {
                        id_formation = vm.selectedItemGroupe_participant_ebe.id_realisation_ebe;
                    }

                    var datas = $.param(
                    {                        
                        supprimer:etat_suppression,
                        id: vm.selectedItemGroupe_participant_ebe.id,  
                        id_menage: vm.selectedItemGroupe_participant_ebe.id_menage,
                        id_realisation_ebe : id_formation 
                    });
                    console.log(datas);
                    apiFactory.add("participant_realisation_ebe/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                      
                        if (!vm.nouvelItemGroupe_participant_ebe) 
                        {
                            if (etat_suppression == 0) 
                            {                                   
                                var gr = vm.allMenage.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_participant_ebe.id_menage;
                                });                              
                                
                                vm.selectedItemGroupe_participant_ebe.menage = gr[0];
                                vm.selectedItemGroupe_participant_ebe.$edit = false ;
                                vm.selectedItemGroupe_participant_ebe.$selected = false ;
                                vm.selectedItemGroupe_participant_ebe = {} ;
                            }
                            else
                            {
                                vm.allGroupe_participant_ebe = vm.allGroupe_participant_ebe.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemGroupe_participant_ebe.id;
                                });

                                vm.selectedItemGroupe_participant_ebe = {} ;
                            }

                        }
                        else
                        {                               
                            var gr = vm.allMenage.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemGroupe_participant_ebe.id_menage;
                            });                              
                            
                            vm.selectedItemGroupe_participant_ebe.menage = gr[0];
                            vm.selectedItemGroupe_participant_ebe.$edit = false ;
                            vm.selectedItemGroupe_participant_ebe.$selected = false ;
                            vm.selectedItemGroupe_participant_ebe.id = String(data.response) ;
                            vm.selectedItemGroupe_participant_ebe.id_realisation_ebe = id_formation;

                            vm.nouvelItemGroupe_participant_ebe = false ;
                            vm.selectedItemGroupe_participant_ebe = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }
            //Fin liste groupe participant

        
    }
})();

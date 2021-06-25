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

        
    	vm.selectedItemFiche_collection_donnee_ebe = {};
		var NouvelItemFiche_collection_donnee_ebe=false;
        var currentItemFiche_collection_donnee_ebe;
        vm.fiche_collection_donnee_ebe = {};
        vm.allFiche_collection_donnee_ebe = [];

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
        apiFactory.getAll("espace_bien_etre/index").then(function(result)
        {
            vm.allEspace_bien_etre = result.data.response;
        });
        
        apiFactory.getAll("theme_sensibilisation/index").then(function(result)
        {
            vm.allTheme_sensibilisation = result.data.response;
        });
        apiFactory.getAll("outils_utilise_sensibilisation/index").then(function(result)
        {
            vm.allOutils_utilise = result.data.response;
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
                console.log(vm.filtre.id_groupe_ml_pl);          
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
                {titre:"Date d'édition"},
                {titre:"Espace bien être"},
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
                //vm.realisation_ebe.numero=null;
                vm.realisation_ebe.id_espace_bien_etre=null;
                vm.realisation_ebe.but_regroupement=null;
                vm.realisation_ebe.date_regroupement=null;
                vm.realisation_ebe.date_edition=null;
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
                vm.realisation_ebe.date_edition   = new Date(vm.selectedItemRealisation_ebe.date_edition) ;
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
                 var espace = vm.allEspace_bien_etre.filter(function(obj)
                {
                    return obj.id == vm.selectedItemRealisation_ebe.espace_bien_etre.id ;
                 });
                 if (espace.length!=0)
                 {
                    vm.realisation_ebe.id_espace_bien_etre  = espace[0].id ;                     
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
                        date_edition:  convert_date(realisation_ebe.date_edition),
                        materiel:           realisation_ebe.materiel,
                        lieu:               realisation_ebe.lieu,
                        id_espace_bien_etre:  realisation_ebe.id_espace_bien_etre,
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
                                
                                var espace = vm.allEspace_bien_etre.filter(function(obj)
                                {
                                    return obj.id == realisation_ebe.id_espace_bien_etre  ;
                                });
                                if (espace.length!=0)
                                {                                  
                                    vm.selectedItemRealisation_ebe.espace_bien_etre = espace[0] ;  
                                }
                                vm.selectedItemRealisation_ebe.id_groupe_ml_pl         = realisation_ebe.id_groupe_ml_pl ;
                                vm.selectedItemRealisation_ebe.numero           = realisation_ebe.numero ;
                                vm.selectedItemRealisation_ebe.but_regroupement = realisation_ebe.but_regroupement ;
                                vm.selectedItemRealisation_ebe.date_regroupement = new Date(realisation_ebe.date_regroupement) ;
                                vm.selectedItemRealisation_ebe.date_edition = new Date(realisation_ebe.date_edition) ;
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
                            var espa = [];
                            var contrat = vm.allContrat_agex.filter(function(obj)
                            {
                                return obj.id == realisation_ebe.id_contrat_agex  ;
                            });
                            if (contrat.length!=0)
                            {                                  
                                cont = contrat[0] ;  
                            }
                            
                            var espace = vm.allEspace_bien_etre.filter(function(obj)
                            {
                                return obj.id == realisation_ebe.id_espace_bien_etre  ;
                            });
                            if (espace.length!=0)
                            {                                  
                                espa = espace[0] ;  
                            }
                            var item =
                            {
                            id :                        String(data.response) ,
                            contrat_agex :    cont ,
                            espace_bien_etre :    espa ,
                            id_commune :                realisation_ebe.id_commune ,
                            numero :                    realisation_ebe.numero ,
                            but_regroupement :          realisation_ebe.but_regroupement ,
                            date_regroupement :         new Date(realisation_ebe.date_regroupement) ,
                            date_edition :         new Date(realisation_ebe.date_edition) ,
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
                        ||(currentItemRealisation_ebe.date_edition   != convert_date(item.date_edition) )
                        ||(currentItemRealisation_ebe.materiel            != item.materiel )
                        ||(currentItemRealisation_ebe.lieu                != item.lieu )
                        ||(currentItemRealisation_ebe.contrat_agex.id   != item.id_contrat_agex ) 
                        ||(currentItemRealisation_ebe.espace_bien_etre.id   != item.id_espace_bien_etre )
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
                            id_theme_sensibilisation : null,
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
                    vm.selectedItemTheme_formation_ebe.id_theme_sensibilisation = vm.selectedItemTheme_formation_ebe.theme_sensibilisation.id  ;                   
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
                        id_theme_sensibilisation: vm.selectedItemTheme_formation_ebe.id_theme_sensibilisation,
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
                                var theme = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemTheme_formation_ebe.id_theme_sensibilisation;
                                });
                                
                                vm.selectedItemTheme_formation_ebe.theme_sensibilisation = theme[0] ;
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
                            
                            var theme = vm.allTheme_sensibilisation.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemTheme_formation_ebe.id_theme_sensibilisation;
                            });
                            
                            vm.selectedItemTheme_formation_ebe.theme_sensibilisation = theme[0] ;
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
                
               apiFactory.getAPIgeneraliserREST("participant_realisation_ebe/index","menu","get_participantByrealisationgroupe","id_realisation_ebe",vm.selectedItemRealisation_ebe.id,"id_groupe_ml_pl",vm.filtre.id_groupe_ml_pl).then(function(result){
                vm.allGroupe_participant_ebe = result.data.response;                    
                vm.affiche_load = false ;
                console.log(vm.allGroupe_participant_ebe);
            });
               /*apiFactory.getAPIgeneraliserREST("participant_realisation_ebe/index","cle_etrangere",vm.selectedItemRealisation_ebe.id).then(function(result){
                    vm.allGroupe_participant_ebe = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allGroupe_participant_ebe);
                }); */
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
                                        {titre:"Présence"},
                                        {titre:"Ménage"},
                                        {titre:"Nombre enfant moins six ans"},
                                        {titre:"Date presence"}
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
                            date_presence : null
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
                    current_selectedItemGroupe_participant_ebe = angular.copy(vm.selectedItemGroupe_participant_ebe);
                    if (vm.selectedItemGroupe_participant_ebe.id)
                    {
                        vm.nouvelItemGroupe_participant_ebe = false ;
                        vm.selectedItemGroupe_participant_ebe.$edit = true;
                        vm.selectedItemGroupe_participant_ebe.date_presence = new Date(vm.selectedItemGroupe_participant_ebe.date_presence);
                    }
                    else
                    {
                        vm.nouvelItemGroupe_participant_ebe = true ;
                        vm.selectedItemGroupe_participant_ebe.$edit = true;
                        vm.selectedItemGroupe_participant_ebe.id = '0';
                        vm.selectedItemGroupe_participant_ebe.id_menage = vm.selectedItemGroupe_participant_ebe.id_menage_prevu;
                        vm.selectedItemGroupe_participant_ebe.date_presence = null;
                    }
                    
                                     
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
                        
                        //vm.allGroupe_participant_ebe.shift();
                        //vm.selectedItemGroupe_participant_ebe = {} ;
                        
                        vm.selectedItemGroupe_participant_ebe.$selected = false;
                        vm.selectedItemGroupe_participant_ebe.$edit = false;
                        vm.selectedItemGroupe_participant_ebe = current_selectedItemGroupe_participant_ebe ;
                        vm.selectedItemGroupe_participant_ebe.checkbox_menage =false;
                        vm.nouvelItemGroupe_participant_ebe = false ;
                        vm.selectedItemGroupe_participant_ebe = {} ;
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
                            vm.selectedItemGroupe_participant_ebe = current_selectedItemGroupe_participant_ebe ;
                            
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
                        date_presence:convert_date(vm.selectedItemGroupe_participant_ebe.date_presence),
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
                                /*var gr = vm.allMenage.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_participant_ebe.id_menage;
                                });*/                              
                                
                               // vm.selectedItemGroupe_participant_ebe.menage = gr[0];
                                vm.selectedItemGroupe_participant_ebe.$edit = false ;
                                vm.selectedItemGroupe_participant_ebe.$selected = false ;
                                vm.selectedItemGroupe_participant_ebe = {} ;
                            }
                            else
                            {
                                /*vm.allGroupe_participant_ebe = vm.allGroupe_participant_ebe.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemGroupe_participant_ebe.id;
                                });*/
                                vm.selectedItemGroupe_participant_ebe.$edit = false ;
                                vm.selectedItemGroupe_participant_ebe.$selected = false ;
                                vm.selectedItemGroupe_participant_ebe.id = null;
                                vm.selectedItemGroupe_participant_ebe.id_realisation_ebe = null;
                                vm.selectedItemGroupe_participant_ebe.checkbox_menage = false;
                                vm.selectedItemGroupe_participant_ebe.date_presence = null;
                                vm.selectedItemGroupe_participant_ebe = {} ;
                            }

                        }
                        else
                        {                               
                           /* var gr = vm.allMenage.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemGroupe_participant_ebe.id_menage;
                            }); */                             
                            
                           // vm.selectedItemGroupe_participant_ebe.menage = gr[0];
                            vm.selectedItemGroupe_participant_ebe.$edit = false ;
                            vm.selectedItemGroupe_participant_ebe.$selected = false ;
                            vm.selectedItemGroupe_participant_ebe.id = String(data.response) ;
                            vm.selectedItemGroupe_participant_ebe.id_realisation_ebe = id_formation;
                            vm.selectedItemGroupe_participant_ebe.checkbox_menage = true;

                            vm.nouvelItemGroupe_participant_ebe = false ;
                            vm.selectedItemGroupe_participant_ebe = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }
            //Fin liste groupe participant

            //debut fiche de collection de donnée ebe
            
      vm.get_fiche_collection_donnee_ebe = function()
      {
          apiFactory.getAPIgeneraliserREST("fiche_collection_donnee_ebe/index","menu","getfiche_collection_donnee_ebeByrealisation",
          "id_realisation_ebe",vm.selectedItemRealisation_ebe.id).then(function(result) { 
              vm.allFiche_collection_donnee_ebe = result.data.response;
              console.log(vm.allFiche_collection_donnee_ebe);
          });           
          vm.selectedItemFiche_collection_donnee_ebe ={};
      }
            vm.fiche_collection_donnee_ebe_column = 
            [   
                {titre:"Date"},
                {titre:"Localité"},
                {titre:"Thème abordé"},
                {titre:"Outils utilisés"},
                {titre:"Nombre de participants Femme"},
                {titre:"Nombre de participants Homme"},
                {titre:"Nombre de participants Enfant"},
                {titre:"Animateur"},
                {titre:"Observation"}
            ];                       

            vm.selectionFiche_collection_donnee_ebe = function (item) 
            {
                vm.selectedItemFiche_collection_donnee_ebe = item ;
                console.log(vm.selectedItemFiche_collection_donnee_ebe);
            }

            $scope.$watch('vm.selectedItemFiche_collection_donnee_ebe', function() {
                if (!vm.allFiche_collection_donnee_ebe) return;
                vm.allFiche_collection_donnee_ebe.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFiche_collection_donnee_ebe.$selected = true;
            });

            vm.ajoutFiche_collection_donnee_ebe = function(fiche_collection_donnee_ebe,suppression)
            {
                if (NouvelItemFiche_collection_donnee_ebe==false)
                {
                    test_existenceFiche_collection_donnee_ebe(fiche_collection_donnee_ebe,suppression); 
                }
                else
                {
                    insert_in_baseFiche_collection_donnee_ebe(fiche_collection_donnee_ebe,suppression);
                }
            }
            vm.ajouterFiche_collection_donnee_ebe = function ()
            {
                vm.selectedItemFiche_collection_donnee_ebe.$selected = false;
                NouvelItemFiche_collection_donnee_ebe = true ;
                vm.fiche_collection_donnee_ebe.supprimer=0;
                vm.fiche_collection_donnee_ebe.id=0;
                vm.fiche_collection_donnee_ebe.numero=null;
                vm.fiche_collection_donnee_ebe.date= null;
                vm.fiche_collection_donnee_ebe.localite=null;
                vm.fiche_collection_donnee_ebe.id_theme_sensibilisation=null;
                vm.fiche_collection_donnee_ebe.id_outils_utilise=null;
                vm.fiche_collection_donnee_ebe.nbr_femme=null;
                vm.fiche_collection_donnee_ebe.nbr_homme=null;
                vm.fiche_collection_donnee_ebe.nbr_enfant=null;	
                vm.fiche_collection_donnee_ebe.animateur=null;
                vm.fiche_collection_donnee_ebe.observation=null;	
                vm.affichage_masque_fiche_collection_donnee_ebe=true;
                vm.selectedItemFiche_collection_donnee_ebe = {};
            }
            vm.annulerFiche_collection_donnee_ebe = function(item)
            {
                vm.selectedItemFiche_collection_donnee_ebe={};
                vm.selectedItemFiche_collection_donnee_ebe.$selected = false;
                NouvelItemFiche_collection_donnee_ebe = false;
                vm.affichage_masque_fiche_collection_donnee_ebe=false;
                vm.fiche_collection_donnee_ebe = {};
            };

            vm.modifFiche_collection_donnee_ebe = function () 
            {
                NouvelItemFiche_collection_donnee_ebe = false;                
                currentItemFiche_collection_donnee_ebe = JSON.parse(JSON.stringify(vm.selectedItemFiche_collection_donnee_ebe));
                vm.fiche_collection_donnee_ebe.date   = new Date(vm.selectedItemFiche_collection_donnee_ebe.date) 
                vm.fiche_collection_donnee_ebe.localite  = vm.selectedItemFiche_collection_donnee_ebe.localite;
                vm.fiche_collection_donnee_ebe.id_theme_sensibilisation  = vm.selectedItemFiche_collection_donnee_ebe.theme_sensibilisation.id ;
                vm.fiche_collection_donnee_ebe.id_outils_utilise  = vm.selectedItemFiche_collection_donnee_ebe.outils_utilise.id ;
                vm.fiche_collection_donnee_ebe.nbr_femme = parseInt(vm.selectedItemFiche_collection_donnee_ebe.nbr_femme);
                vm.fiche_collection_donnee_ebe.nbr_homme = parseInt(vm.selectedItemFiche_collection_donnee_ebe.nbr_homme);
                vm.fiche_collection_donnee_ebe.nbr_enfant = parseInt(vm.selectedItemFiche_collection_donnee_ebe.nbr_enfant);
                vm.fiche_collection_donnee_ebe.animateur = vm.selectedItemFiche_collection_donnee_ebe.animateur ;
                vm.fiche_collection_donnee_ebe.observation  = vm.selectedItemFiche_collection_donnee_ebe.observation ;
                vm.affichage_masque_fiche_collection_donnee_ebe=true;
            }

            vm.supprimerFiche_collection_donnee_ebe = function()
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

                    insert_in_baseFiche_collection_donnee_ebe(vm.selectedItemFiche_collection_donnee_ebe,1);
                }, function() {
                });
            }

            function insert_in_baseFiche_collection_donnee_ebe (fiche_collection_donnee_ebe, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    var id_reali = vm.selectedItemRealisation_ebe.id
                    if (!NouvelItemFiche_collection_donnee_ebe) 
                    {
                        id = vm.selectedItemFiche_collection_donnee_ebe.id ;
                        id_reali = vm.selectedItemFiche_collection_donnee_ebe.id_realisation_ebe;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:          etat_suppression,
                        date:           convert_date(fiche_collection_donnee_ebe.date),
                        localite:             fiche_collection_donnee_ebe.localite,
                        id_theme_sensibilisation:  fiche_collection_donnee_ebe.id_theme_sensibilisation ,
                        id_outils_utilise:    fiche_collection_donnee_ebe.id_outils_utilise,
                        nbr_homme:              fiche_collection_donnee_ebe.nbr_homme,
                        nbr_femme:              fiche_collection_donnee_ebe.nbr_femme,
                        nbr_enfant:              fiche_collection_donnee_ebe.nbr_enfant,
                        animateur:               fiche_collection_donnee_ebe.animateur,
                        observation:               fiche_collection_donnee_ebe.observation,
                        id_realisation_ebe:  id_reali          
                        
                    });
console.log(datas);
                    apiFactory.add("fiche_collection_donnee_ebe/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFiche_collection_donnee_ebe) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var outil = vm.allOutils_utilise.filter(function(obj)
                                {
                                    return obj.id == fiche_collection_donnee_ebe.id_outils_utilise  ;
                                });             
                                
                                var them = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == fiche_collection_donnee_ebe.id_theme_sensibilisation  ;
                                });
                                vm.selectedItemFiche_collection_donnee_ebe.theme_sensibilisation = them[0] ;                   
                                vm.selectedItemFiche_collection_donnee_ebe.outils_utilise = outil[0] ;
                                vm.selectedItemFiche_collection_donnee_ebe.date = new Date(fiche_collection_donnee_ebe.date) ;
                                vm.selectedItemFiche_collection_donnee_ebe.localite           = fiche_collection_donnee_ebe.localite ;
                                vm.selectedItemFiche_collection_donnee_ebe.nbr_femme = fiche_collection_donnee_ebe.nbr_femme ;
                                vm.selectedItemFiche_collection_donnee_ebe.nbr_homme = fiche_collection_donnee_ebe.nbr_homme ;
                                vm.selectedItemFiche_collection_donnee_ebe.nbr_enfant = fiche_collection_donnee_ebe.nbr_enfant ;
                                vm.selectedItemFiche_collection_donnee_ebe.animateur         = fiche_collection_donnee_ebe.animateur ; 
                                vm.selectedItemFiche_collection_donnee_ebe.observation         = fiche_collection_donnee_ebe.observation ;                            
                            }
                            else
                            {
                                vm.allFiche_collection_donnee_ebe = vm.allFiche_collection_donnee_ebe.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFiche_collection_donnee_ebe.id ;
                                });
                            }

                        }
                        else
                        {   
                            var outil = vm.allOutils_utilise.filter(function(obj)
                                {
                                    return obj.id == fiche_collection_donnee_ebe.id_outils_utilise  ;
                                });             
                                
                                var them = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == fiche_collection_donnee_ebe.id_theme_sensibilisation  ;
                                });
                               // vm.selectedItemFiche_collection_donnee_ebe.theme_sensibilisation = them[0] ;                   
                               // vm.selectedItemFiche_collection_donnee_ebe.groupe_ml_pl = group[0] ;
                            var item =
                            {
                            id :    String(data.response) ,
                            outils_utilise :    outil[0] ,
                            theme_sensibilisation :    them[0] ,
                            date :      new Date(fiche_collection_donnee_ebe.date) ,
                            localite :        fiche_collection_donnee_ebe.localite ,
                            duree :         fiche_collection_donnee_ebe.duree ,
                            nbr_homme :          fiche_collection_donnee_ebe.nbr_homme ,
                            nbr_femme :          fiche_collection_donnee_ebe.nbr_femme ,
                            nbr_enfant :          fiche_collection_donnee_ebe.nbr_enfant ,
                            animateur :          fiche_collection_donnee_ebe.animateur ,
                            observation :          fiche_collection_donnee_ebe.observation ,
                            id_realisation_ebe :    id_reali 
                            }
                            vm.allFiche_collection_donnee_ebe.unshift(item) ;
					        
                        }
                        NouvelItemFiche_collection_donnee_ebe = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque_fiche_collection_donnee_ebe=false;
                        vm.fiche_collection_donnee_ebe = {};
                        vm.selectedItemFiche_collection_donnee_ebe ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFiche_collection_donnee_ebe (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemFiche_collection_donnee_ebe.localite             != item.localite )
                        ||(currentItemFiche_collection_donnee_ebe.outils_utilise.id != item.id_outils_utilise )
                        ||(currentItemFiche_collection_donnee_ebe.date   != convert_date(item.date) )
                        ||(currentItemFiche_collection_donnee_ebe.nbr_homme      != item.nbr_homme )
                        ||(currentItemFiche_collection_donnee_ebe.nbr_femme      != item.nbr_femme )
                        ||(currentItemFiche_collection_donnee_ebe.nbr_enfant      != item.nbr_enfant )
                        ||(currentItemFiche_collection_donnee_ebe.animateur      != item.animateur )
                        ||(currentItemFiche_collection_donnee_ebe.observation       != item.observation )
                        ||(currentItemFiche_collection_donnee_ebe.theme_sensibilisation.id   != item.id_theme_sensibilisation)
                        )                    
                    { 
                            insert_in_baseFiche_collection_donnee_ebe(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseFiche_collection_donnee_ebe(item,suppression);		
            }
            //fin fiche de collection de donnée ebe

        
    }
})();

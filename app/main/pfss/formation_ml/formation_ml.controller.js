(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_ml')
        .controller('Formation_mlController', Formation_mlController);

    /** @ngInject */
    function Formation_mlController(apiFactory, $scope, $mdDialog,$state)
    {console.log($state);
        //console.log(type_sous_projet);
    	var vm = this ;
        vm.date_now = new Date();
        var id_sous_projet_state = $state.current.id_sous_projet;
        vm.type_sous_projet = $state.current.type_sous_projet;
    	vm.selectedItemFormation_ml = {};
		var NouvelItemFormation_ml=false;
        var currentItemFormation_ml;

        vm.allFormation_ml = [];
        vm.formation_ml = {};

        vm.selectedItemTheme_formation_ml = {} ;
        var current_selectedItemTheme_formation_ml = {} ;
        vm.nouvelItemTheme_formation_ml = false ;
        vm.allTheme_formation_ml = [] ;
        vm.affiche_load = false ;

        vm.affiche_bouton_outils = false;
        vm.outil_communication ={};
        vm.allOutils_communication = {};

        
        /*vm.selectedItemGroupe_participant_ml = {} ;
        var current_selectedItemGroupe_participant_ml = {} ;
        vm.nouvelItemGroupe_participant_ml = false ;
        vm.allGroupe_participant_ml = [];*/

        vm.selectedItemFormation_ml_repartition = {};
		var NouvelItemFormation_ml_repartition=false;
        var currentItemFormation_ml_repartition;
        

        vm.allFormation_ml_repartition = [];
        vm.formation_ml_repartition = {};

        
        vm.selectedItemFormation_ml_repartition_village = {} ;
        var current_selectedItemFormation_ml_repartition_village = {} ;
        vm.nouvelItemFormation_ml_repartition_village = false ;
        vm.allFormation_ml_repartition_village = [];

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

        apiFactory.getAll("Ile/index").then(function(result)
        {
            vm.all_ile = result.data.response;
        });
        apiFactory.getAPIgeneraliserREST("theme_formation_ml/index","menu","theme_sensibilisation").then(function(result)
        {
            vm.allTheme_sensibilisation = result.data.response;
        });
        
        /*apiFactory.getAll("theme_sensibilisation/index").then(function(result)
        {
            vm.allTheme_sensibilisation = result.data.response;
        });*/

        vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ;            
        });
      }
            
      vm.get_formation_ml = function()
      {
          apiFactory.getAPIgeneraliserREST("formation_ml/index","menu","getformation_mlBysousprojetcommune",'id_sous_projet',id_sous_projet_state,
          "id_commune",vm.filtre.id_commune).then(function(result) { 
              vm.allFormation_ml = result.data.response;
              console.log(vm.allFormation_ml);
          });           
          vm.selectedItemFormation_ml ={};
      }
            vm.formation_ml_column = 
            [   
                {titre:"Contrat ONG N°"},
                {titre:"Formation N°"},
                {titre:"Description"},
                {titre:"Date de debut"},
                {titre:"Date de fin"},
                {titre:"Lieu"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemFormation_ml = item ;
                console.log(vm.selectedItemFormation_ml);
            }

            $scope.$watch('vm.selectedItemFormation_ml', function() {
                if (!vm.allFormation_ml) return;
                vm.allFormation_ml.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFormation_ml.$selected = true;
            });

            vm.ajoutFormation_ml = function(formation_ml,suppression)
            {
                if (NouvelItemFormation_ml==false)
                {
                    test_existenceFormation_ml(formation_ml,suppression); 
                }
                else
                {
                    insert_in_baseFormation_ml(formation_ml,suppression);
                }
            }
            vm.ajouterFormation_ml = function ()
            {
                vm.selectedItemFormation_ml.$selected = false;
                NouvelItemFormation_ml = true ;
                vm.formation_ml.supprimer=0;
                vm.formation_ml.id=0;
                vm.formation_ml.numero=null;
                vm.formation_ml.date_debut=null;
                vm.formation_ml.id_contrat_agex=null;
                vm.formation_ml.id_commune= vm.filtre.id_commune;
                vm.formation_ml.date_fin=null;
                vm.formation_ml.lieu=null;
                //vm.formation_ml.id_commune=null;		
                vm.affichage_masque=true;
                vm.selectedItemFormation_ml = {};
            }
            vm.annulerFormation_ml = function(item)
            {
                vm.selectedItemFormation_ml={};
                vm.selectedItemFormation_ml.$selected = false;
                NouvelItemFormation_ml = false;
                vm.affichage_masque=false;
                vm.formation_ml = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFormation_ml = function () 
            {
                NouvelItemFormation_ml = false;                
                currentItemFormation_ml = JSON.parse(JSON.stringify(vm.selectedItemFormation_ml));
                vm.formation_ml.numero  = parseInt(vm.selectedItemFormation_ml.numero) ;
                vm.formation_ml.id_commune  = vm.selectedItemFormation_ml.id_commune ;
                vm.formation_ml.description   = vm.selectedItemFormation_ml.description ;
                vm.formation_ml.lieu = vm.selectedItemFormation_ml.lieu ;
                vm.formation_ml.date_debut  = new Date(vm.selectedItemFormation_ml.date_debut) ;
                vm.formation_ml.date_fin  = new Date(vm.selectedItemFormation_ml.date_fin) ;

                var contrat = vm.allContrat_agex.filter(function(obj)
                {
                    return obj.id == vm.selectedItemFormation_ml.contrat_agex.id ;
                 });
                 if (contrat.length!=0)
                 {
                    vm.formation_ml.id_contrat_agex  = contrat[0].id ;                     
                 }
                vm.affichage_masque=true;
            }

            vm.supprimerFormation_ml = function()
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

                    insert_in_baseFormation_ml(vm.selectedItemFormation_ml,1);
                }, function() {
                });
            }

            function insert_in_baseFormation_ml (formation_ml, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemFormation_ml) 
                    {
                        id = vm.selectedItemFormation_ml.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        numero:formation_ml.numero,
                        description:formation_ml.description,
                        id_contrat_agex:formation_ml.id_contrat_agex,
                        id_commune:formation_ml.id_commune,
                        lieu:formation_ml.lieu,
                        date_debut:convert_date(formation_ml.date_debut),
                        date_fin:convert_date(formation_ml.date_fin)              
                        
                    });

                    apiFactory.add("formation_ml/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFormation_ml) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var contrat = vm.allContrat_agex.filter(function(obj)
                                {
                                    return obj.id == formation_ml.id_contrat_agex  ;
                                });
                                if (contrat.length!=0)
                                {                                  
                                    vm.selectedItemFormation_ml.contrat_agex = contrat[0] ;  
                                }
                                vm.selectedItemFormation_ml.id_commune = formation_ml.id_commune ;
                                vm.selectedItemFormation_ml.numero = formation_ml.numero ;
                                vm.selectedItemFormation_ml.description = formation_ml.description ;
                                vm.selectedItemFormation_ml.lieu = formation_ml.lieu ;
                                vm.selectedItemFormation_ml.date_debut = new Date(formation_ml.date_debut) ;
                                vm.selectedItemFormation_ml.date_fin = new Date(formation_ml.date_fin) ;                               
                            }
                            else
                            {
                                vm.allFormation_ml = vm.allFormation_ml.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFormation_ml.id ;
                                });
                            }

                        }
                        else
                        {   var cont = [];
                            var contrat = vm.allContrat_agex.filter(function(obj)
                            {
                                return obj.id == formation_ml.id_contrat_agex  ;
                            });
                            if (contrat.length!=0)
                            {                                  
                                cont = contrat[0] ;  
                            }
                            var item =
                            {
                            id : String(data.response) ,
                            contrat_agex : cont ,
                            id_commune : formation_ml.id_commune ,
                            numero : formation_ml.numero ,
                            description : formation_ml.description ,
                            lieu : formation_ml.lieu ,
                            date_debut : new Date(formation_ml.date_debut) ,
                            date_fin : new Date(formation_ml.date_fin)
                            }
                            vm.allFormation_ml.unshift(item) ;
					        
                        }
                        NouvelItemFormation_ml = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.formation_ml = {};
                        vm.selectedItemFormation_ml ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFormation_ml (item,suppression)
            {
                console.log(item);
                console.log(currentItemFormation_ml);
                if (suppression!=1) 
                {                    
                    if((currentItemFormation_ml.numero   != item.numero )
                        ||(currentItemFormation_ml.description    != item.description )
                        ||(currentItemFormation_ml.lieu != item.lieu )
                        ||(currentItemFormation_ml.date_debut   != convert_date(item.date_debut) )
                        ||(currentItemFormation_ml.date_fin   != convert_date(item.date_fin))
                        ||(currentItemFormation_ml.contrat_agex.id   != item.id_contrat_agex )
                        )                    
                    { 
                            insert_in_baseFormation_ml(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseFormation_ml(item,suppression);		
            }
        //Formation ml fin

        //ETAT PAIEMENT
       
            
            vm.click_theme_formation_ml = function () 
            {
                vm.affiche_load = true ;
               apiFactory.getAPIgeneraliserREST("theme_formation_ml/index","cle_etrangere",vm.selectedItemFormation_ml.id).then(function(result){
                    vm.allTheme_formation_ml = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allTheme_formation_ml);
                }); 
                vm.selectedItemTheme_formation_ml = {}; 
            }
        
            vm.theme_formation_ml_column =[  
                                        {titre:"Theme de sensibilisation"},
                                        {titre:"Numero"},
                                        {titre:"Date formation"}
                                    ];

                vm.selectionTheme_formation_ml = function(item)
                {
                    vm.selectedItemTheme_formation_ml = item ;

                    if (!vm.selectedItemTheme_formation_ml.$edit) 
                    {
                        vm.nouvelItemTheme_formation_ml = false ;  

                    }

                }

                $scope.$watch('vm.selectedItemTheme_formation_ml', function()
                {
                    if (!vm.allTheme_formation_ml) return;
                    vm.allTheme_formation_ml.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemTheme_formation_ml.$selected = true;

                });
               
                vm.ajouterTheme_formation_ml = function()
                {
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_theme_sensibilisation : null,
                            numero : null,
                            date_formation : null
                        } ;

                    vm.nouvelItemTheme_formation_ml = true ;                    

                    vm.allTheme_formation_ml.unshift(item);
                    vm.allTheme_formation_ml.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemTheme_formation_ml = af;
                        
                      }
                    });
                }

                vm.modifierTheme_formation_ml = function()
                {
                    vm.nouvelItemTheme_formation_ml = false ;
                    vm.selectedItemTheme_formation_ml.$edit = true;
                
                    current_selectedItemTheme_formation_ml = angular.copy(vm.selectedItemTheme_formation_ml);
                    vm.selectedItemTheme_formation_ml.numero = vm.selectedItemTheme_formation_ml.numero ;
                    vm.selectedItemTheme_formation_ml.id_theme_sensibilisation = vm.selectedItemTheme_formation_ml.theme_sensibilisation.id ;
                    vm.selectedItemTheme_formation_ml.date_formation = new Date(vm.selectedItemTheme_formation_ml.date_formation) ;                    
                }

                vm.supprimerTheme_formation_ml = function()
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

                    vm.enregistrerTheme_formation_ml(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annulerTheme_formation_ml = function()
                {
                    if (vm.nouvelItemTheme_formation_ml) 
                    {
                        
                        vm.allTheme_formation_ml.shift();
                        vm.selectedItemTheme_formation_ml = {} ;
                        vm.nouvelItemTheme_formation_ml = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemTheme_formation_ml.$edit) //annuler selection
                        {
                            vm.selectedItemTheme_formation_ml.$selected = false;
                            vm.selectedItemTheme_formation_ml = {};
                        }
                        else
                        {
                            vm.selectedItemTheme_formation_ml.$selected = false;
                            vm.selectedItemTheme_formation_ml.$edit = false;
                            vm.selectedItemTheme_formation_ml.numero = current_selectedItemTheme_formation_ml.numero ;
                            vm.selectedItemTheme_formation_ml.id_theme_sensibilisation = current_selectedItemTheme_formation_ml.theme_sensibilisation.id ;
                            
                            vm.selectedItemTheme_formation_ml.date_formation = current_selectedItemTheme_formation_ml.date_formation ;
                            
                            vm.selectedItemTheme_formation_ml = {};
                        }

                        

                    }
                }

                vm.enregistrerTheme_formation_ml = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };
                    var id_formation = vm.selectedItemFormation_ml.id;
                    if (vm.nouvelItemTheme_formation_ml==false)
                    {
                        id_formation = vm.selectedItemTheme_formation_ml.id_formation_ml;
                    }

                    var datas = $.param(
                    {                        
                        supprimer:etat_suppression,
                        id: vm.selectedItemTheme_formation_ml.id,
                        numero: vm.selectedItemTheme_formation_ml.numero,  
                        id_theme_sensibilisation: vm.selectedItemTheme_formation_ml.id_theme_sensibilisation,
                        date_formation : convert_date(vm.selectedItemTheme_formation_ml.date_formation),
                        id_formation_ml : id_formation 
                    });
                    console.log(datas);
                    apiFactory.add("theme_formation_ml/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                      
                        if (!vm.nouvelItemTheme_formation_ml) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                var the = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemTheme_formation_ml.id_theme_sensibilisation;
                                });                              
                                
                                vm.selectedItemTheme_formation_ml.theme_sensibilisation = the[0];
                                vm.selectedItemTheme_formation_ml.$edit = false ;
                                vm.selectedItemTheme_formation_ml.$selected = false ;
                                vm.selectedItemTheme_formation_ml = {} ;
                            }
                            else
                            {
                                vm.allTheme_formation_ml = vm.allTheme_formation_ml.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemTheme_formation_ml.id;
                                });

                                vm.selectedItemTheme_formation_ml = {} ;
                            }

                        }
                        else
                        {   
                            var the = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemTheme_formation_ml.id_theme_sensibilisation;
                                });
                            vm.selectedItemTheme_formation_ml.theme_sensibilisation = the[0];
                            vm.selectedItemTheme_formation_ml.$edit = false ;
                            vm.selectedItemTheme_formation_ml.$selected = false ;
                            vm.selectedItemTheme_formation_ml.id = String(data.response) ;
                            vm.selectedItemTheme_formation_ml.id_formation_ml = id_formation;

                            vm.nouvelItemTheme_formation_ml = false ;
                            vm.selectedItemTheme_formation_ml = {};

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

            //Debut outils de communication
            
            vm.click_outils_communication = function () 
            {   
                vm.affiche_load = true ;
                vm.outil_communication = {};
                apiFactory.getAPIgeneraliserREST("outils_communication/index","menu","getoutils_communicationbyformation",'id_formation_ml',vm.selectedItemFormation_ml.id).then(function(result) { 
                                        
                    vm.allOutils_communication = result.data.response;
                    console.log(vm.allOutils_communication);                        
                    
                    vm.affiche_load =false;
                    if (vm.allOutils_communication.length!=0)
                    {
                        if (vm.allOutils_communication[0].outils_communication)
                        {
                            angular.forEach(vm.allOutils_communication[0].outils_communication, function(value, key)
                            {
                                
                                switch(value)
                                {
                                    case 'bache':
                                    {
                                        vm.outil_communication.bache = true ;
                                        break ;
                                    }
    
                                    case 'support_audio_visuel':
                                    {
                                        vm.outil_communication.support_audio_visuel = true ;
                                        break ;
                                    }
    
                                    case 'banderole':
                                    {
                                        vm.outil_communication.banderole = true ;
                                        break;
                                    }
    
                                    case 'facebook':
                                    {
                                        vm.outil_communication.facebook = true ;
                                        break;
                                    }
    
                                    case 'roll_up':
                                    {
                                        vm.outil_communication.roll_up = true ;
                                        break;
                                    }
                                    case 'depliant':
                                    {
                                        vm.outil_communication.depliant = true ;
                                        break;
                                    }
                                    case 'spot_audio_visuel':
                                    {
                                        vm.outil_communication.spot_audio_visuel = true ;
                                        break;
                                    }
                                    case 'television':
                                    {
                                        vm.outil_communication.television = true ;
                                        break;
                                    }
                                    case 'minaret':
                                    {
                                        vm.outil_communication.minaret = true ;
                                        break;
                                    }
                                    case 'megaphone':
                                    {
                                        vm.outil_communication.megaphone = true ;
                                        break;
                                    }
                                    case 'radio_mobile':
                                    {
                                        vm.outil_communication.radio_mobile = true ;
                                        break;
                                    }
                                    case 'carnaval':
                                    {
                                        vm.outil_communication.carnaval = true ;
                                        break;
                                    }
                                    case 'caravane_communication':
                                    {
                                        vm.outil_communication.caravane_communication = true ;
                                        break;
                                    }
                                    default:
                                    {
                                        break ;
                                    }
                                }  
                            }); 
                        }
                        else
                        {
                            vm.outil_communication = {};
                        }
                        
                    }
                    else
                    {
                        vm.outil_communication = {};
                    }
                }); 
            } 
            
            vm.change_outils_communication = function()
            {
                vm.affiche_bouton_outils = true;
            }
            vm.annulerOutils_communication = function()
            {
                vm.outil_communication = {};
                if (vm.allOutils_communication.length!=0)
                    {
                        if (vm.allOutils_communication[0].outils_communication)
                        {
                            angular.forEach(vm.allOutils_communication[0].outils_communication, function(value, key)
                            {
                                
                                switch(value)
                                {
                                    case 'bache':
                                    {
                                        vm.outil_communication.bache = true ;
                                        break ;
                                    }
    
                                    case 'support_audio_visuel':
                                    {
                                        vm.outil_communication.support_audio_visuel = true ;
                                        break ;
                                    }
    
                                    case 'banderole':
                                    {
                                        vm.outil_communication.banderole = true ;
                                        break;
                                    }
    
                                    case 'facebook':
                                    {
                                        vm.outil_communication.facebook = true ;
                                        break;
                                    }
    
                                    case 'roll_up':
                                    {
                                        vm.outil_communication.roll_up = true ;
                                        break;
                                    }
                                    case 'depliant':
                                    {
                                        vm.outil_communication.depliant = true ;
                                        break;
                                    }
                                    case 'spot_audio_visuel':
                                    {
                                        vm.outil_communication.spot_audio_visuel = true ;
                                        break;
                                    }
                                    case 'television':
                                    {
                                        vm.outil_communication.television = true ;
                                        break;
                                    }
                                    case 'minaret':
                                    {
                                        vm.outil_communication.minaret = true ;
                                        break;
                                    }
                                    case 'megaphone':
                                    {
                                        vm.outil_communication.megaphone = true ;
                                        break;
                                    }
                                    case 'radio_mobile':
                                    {
                                        vm.outil_communication.radio_mobile = true ;
                                        break;
                                    }
                                    case 'carnaval':
                                    {
                                        vm.outil_communication.carnaval = true ;
                                        break;
                                    }
                                    case 'caravane_communication':
                                    {
                                        vm.outil_communication.caravane_communication = true ;
                                        break;
                                    }
                                    default:
                                    {
                                        break ;
                                    }
                                }  
                            }); 
                        }
                        else
                        {
                            vm.outil_communication = {};
                        }
                        
                    }
                    else
                    {
                        vm.outil_communication = {};
                    }
                    vm.affiche_bouton_outils = false;
            }
            
            vm.enregistrerOutils_communication = function()
            {
                vm.affiche_load = true ;
                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };
                var id_outils = 0;
                if (vm.allOutils_communication.length!=0)
                {
                    id_outils = vm.allOutils_communication[0].id;
                    console.log('ato');
                }
                var tab = [] ;
                angular.forEach(vm.outil_communication, function(value, key)
                {
                
                        if(key == 'bache' && value == true)
                            {
                                tab.push(key);
                            }

                        if(key == 'support_audio_visuel' && value == true)
                            {
                                tab.push(key);
                            }

                        if(key == 'banderole' && value == true)
                            {
                                tab.push(key);
                            }

                        if(key == 'facebook' && value == true)
                            {
                                tab.push(key);
                            }

                        if(key == 'roll_up' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'depliant' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'spot_audio_visuel' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'television' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'minaret' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'megaphone' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'radio_mobile' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'carnaval' && value == true)
                            {
                                tab.push(key);
                            }
                        if(key == 'caravane_communication' && value == true)
                            {
                                tab.push(key);
                            } 
                    
                });

                var datas = $.param(
                {                        
                    supprimer:0,
                    id: id_outils,
                    outils_communication: tab,
                    id_formation_ml : vm.selectedItemFormation_ml.id 
                });
                console.log(datas);
                apiFactory.add("outils_communication/index",datas, config).success(function (data)
                {
                    vm.affiche_load = false ;
                    vm.affiche_bouton_outils = false;
                    console.log(id_outils);
                    if (id_outils==0)
                    {   
                        var item = {
                            id: data.response, 
                            outils_communication : tab
                        }
                        vm.allOutils_communication.push(item);
                        
                    }
                    else
                    {
                        vm.allOutils_communication[0].outils_communication = tab;
                    }                
                })
                .error(function (data) {alert("Une erreur s'est produit");});
            }
            
            //FIN outils de communication

            //Debut liste groupe participant
            
           /* vm.click_groupe_participant_ml = function () 
            {
                vm.affiche_load = true ;
               apiFactory.getAPIgeneraliserREST("groupe_participant_formation_ml/index","cle_etrangere",vm.selectedItemFormation_ml.id).then(function(result){
                    vm.allGroupe_participant_ml = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allGroupe_participant_ml);
                }); 
                vm.selectedItemGroupe_participant_ml = {}; 
            }
            
            vm.filtre_groupe_ml = function(village_id)
            {
                apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",village_id).then(function(result)
                { 
                vm.allGroupe_ml_pl = result.data.response;            
                });
            }
            vm.change_groupe_ml = function(item)
            {
                var gr = vm.allGroupe_ml_pl.filter(function(obj)
                {
                    return obj.id == item.id_groupe_ml_pl;
                });
                item.telephone = gr[0].telephone;
            }
            vm.groupe_participant_ml_column =[  
                                        {titre:"Village"},
                                        {titre:"Groupe ML/PL"},
                                        {titre:"Téléphone"}
                                    ];

                vm.selectionGroupe_participant_ml = function(item)
                {
                    vm.selectedItemGroupe_participant_ml = item ;

                    if (!vm.selectedItemGroupe_participant_ml.$edit) 
                    {
                        vm.nouvelItemGroupe_participant_ml = false ;  

                    }

                }

                $scope.$watch('vm.selectedItemGroupe_participant_ml', function()
                {
                    if (!vm.allGroupe_participant_ml) return;
                    vm.allGroupe_participant_ml.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemGroupe_participant_ml.$selected = true;

                });
               
                vm.ajouterGroupe_participant_ml = function()
                {
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_groupe_ml_pl : null,
                            id_village : null,
                            nom_groupe : null
                        } ;

                    vm.nouvelItemGroupe_participant_ml = true ;                    

                    vm.allGroupe_participant_ml.unshift(item);
                    vm.allGroupe_participant_ml.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemGroupe_participant_ml = af;
                        
                      }
                    });
                }

                vm.modifierGroupe_participant_ml = function()
                {
                    vm.nouvelItemGroupe_participant_ml = false ;
                    vm.selectedItemGroupe_participant_ml.$edit = true;
                
                    current_selectedItemGroupe_participant_ml = angular.copy(vm.selectedItemGroupe_participant_ml);
                    vm.selectedItemGroupe_participant_ml.id_groupe_ml_pl = vm.selectedItemGroupe_participant_ml.groupe_ml_pl.id;
                    vm.selectedItemGroupe_participant_ml.id_village = vm.selectedItemGroupe_participant_ml.village.id;
                    vm.selectedItemGroupe_participant_ml.chef_village = vm.selectedItemGroupe_participant_ml.groupe_ml_pl.chef_village;
                    apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.selectedItemGroupe_participant_ml.village.id).then(function(result)
                    { 
                        vm.allGroupe_ml_pl = result.data.response;            
                    });                  
                }

                vm.supprimerGroupe_participant_ml = function()
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

                    vm.enregistrerGroupe_participant_ml(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annulerGroupe_participant_ml = function()
                {
                    if (vm.nouvelItemGroupe_participant_ml) 
                    {
                        
                        vm.allGroupe_participant_ml.shift();
                        vm.selectedItemGroupe_participant_ml = {} ;
                        vm.nouvelItemGroupe_participant_ml = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemGroupe_participant_ml.$edit) //annuler selection
                        {
                            vm.selectedItemGroupe_participant_ml.$selected = false;
                            vm.selectedItemGroupe_participant_ml = {};
                        }
                        else
                        {
                            vm.selectedItemGroupe_participant_ml.$selected = false;
                            vm.selectedItemGroupe_participant_ml.$edit = false;
                            vm.selectedItemGroupe_participant_ml.numero = current_selectedItemGroupe_participant_ml.numero ;
                            vm.selectedItemGroupe_participant_ml.id_village = current_selectedItemGroupe_participant_ml.village.id ;
                            vm.selectedItemGroupe_participant_ml.id_groupe_ml_pl = current_selectedItemGroupe_participant_ml.groupe_ml_pl.id ;                            
                            vm.selectedItemGroupe_participant_ml.chef_village = current_selectedItemGroupe_participant_ml.groupe_ml_pl.chef_village ;
                            
                            vm.selectedItemGroupe_participant_ml = {};
                        }

                        

                    }
                }

                vm.enregistrerGroupe_participant_ml = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };
                    var id_formation = vm.selectedItemFormation_ml.id;
                    if (vm.nouvelItemGroupe_participant_ml==false)
                    {
                        id_formation = vm.selectedItemGroupe_participant_ml.id_formation_ml;
                    }

                    var datas = $.param(
                    {                        
                        supprimer:etat_suppression,
                        id: vm.selectedItemGroupe_participant_ml.id,
                        id_village: vm.selectedItemGroupe_participant_ml.id_village,  
                        id_groupe_ml_pl: vm.selectedItemGroupe_participant_ml.id_groupe_ml_pl,
                        id_formation_ml : id_formation 
                    });
                    console.log(datas);
                    apiFactory.add("groupe_participant_formation_ml/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                      
                        if (!vm.nouvelItemGroupe_participant_ml) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                var vil = vm.all_village.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_participant_ml.id_village;
                                });
                                
                                var gr = vm.allGroupe_ml_pl.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_participant_ml.id_groupe_ml_pl;
                                });                              
                                
                                vm.selectedItemGroupe_participant_ml.village = vil[0];
                                vm.selectedItemGroupe_participant_ml.groupe_ml_pl = gr[0];
                                vm.selectedItemGroupe_participant_ml.$edit = false ;
                                vm.selectedItemGroupe_participant_ml.$selected = false ;
                                vm.selectedItemGroupe_participant_ml = {} ;
                            }
                            else
                            {
                                vm.allGroupe_participant_ml = vm.allGroupe_participant_ml.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemGroupe_participant_ml.id;
                                });

                                vm.selectedItemGroupe_participant_ml = {} ;
                            }

                        }
                        else
                        {   
                            
                            var vil = vm.all_village.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemGroupe_participant_ml.id_village;
                            });
                            
                            var gr = vm.allGroupe_ml_pl.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemGroupe_participant_ml.id_groupe_ml_pl;
                            });                              
                            
                            vm.selectedItemGroupe_participant_ml.village = vil[0];
                            vm.selectedItemGroupe_participant_ml.groupe_ml_pl = gr[0];
                            vm.selectedItemGroupe_participant_ml.$edit = false ;
                            vm.selectedItemGroupe_participant_ml.$selected = false ;
                            vm.selectedItemGroupe_participant_ml.id = String(data.response) ;
                            vm.selectedItemGroupe_participant_ml.id_formation_ml = id_formation;

                            vm.nouvelItemGroupe_participant_ml = false ;
                            vm.selectedItemGroupe_participant_ml = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }*/
            //Fin liste groupe participant

            //debut repartition groupe ml pour la formation
            vm.get_formation_ml_repartition = function()
            {
                apiFactory.getAPIgeneraliserREST("formation_ml_repartition/index","menu","getformation_ml_repartitionByformation",'id_formation_ml',vm.selectedItemFormation_ml.id).then(function(result) { 
                    vm.allFormation_ml_repartition = result.data.response;
                    console.log(vm.allFormation_ml_repartition);
                });           
                vm.selectedItemFormation_ml_repartition ={};
            }
            vm.formation_ml_repartition_column = 
            [   
                {titre:"N° de groupe à former"},
                {titre:"Date de formation"},
                {titre:"Nombre de ML pour la formation"},
                {titre:"Lieu de la formation"},
                {titre:"Responsables"}
            ];                       

            vm.selectionFormation_ml_repartition = function (item) 
            {
                vm.selectedItemFormation_ml_repartition = item ;
            }

            $scope.$watch('vm.selectedItemFormation_ml_repartition', function() {
                if (!vm.allFormation_ml_repartition) return;
                vm.allFormation_ml_repartition.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFormation_ml_repartition.$selected = true;
            });

            vm.ajoutFormation_ml_repartition = function(formation_ml_repartition,suppression)
            {
                if (NouvelItemFormation_ml_repartition==false)
                {
                    test_existenceFormation_ml_repartition(formation_ml_repartition,suppression); 
                }
                else
                {
                    insert_in_baseFormation_ml_repartition(formation_ml_repartition,suppression);
                }
            }
            vm.ajouterFormation_ml_repartition = function ()
            {
                vm.selectedItemFormation_ml_repartition.$selected = false;
                NouvelItemFormation_ml_repartition = true ;
                vm.formation_ml_repartition.supprimer=0;
                vm.formation_ml_repartition.id=0;
                vm.formation_ml_repartition.num_groupe=null;
                vm.formation_ml_repartition.date_formation=null;
                vm.formation_ml_repartition.nbr_ml=null;
                vm.formation_ml_repartition.lieu_formation=null;
                vm.formation_ml_repartition.responsable=null;		
                vm.affichage_masque_formation_ml_repartition=true;
                vm.selectedItemFormation_ml_repartition = {};
            }
            vm.annulerFormation_ml_repartition = function(item)
            {
                vm.selectedItemFormation_ml_repartition={};
                vm.selectedItemFormation_ml_repartition.$selected = false;
                NouvelItemFormation_ml_repartition = false;
                vm.affichage_masque_formation_ml_repartition=false;
                vm.formation_ml_repartition = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFormation_ml_repartition = function () 
            {
                NouvelItemFormation_ml_repartition = false;                
                currentItemFormation_ml_repartition = JSON.parse(JSON.stringify(vm.selectedItemFormation_ml_repartition));
                vm.formation_ml_repartition.num_groupe  = parseInt(vm.selectedItemFormation_ml_repartition.num_groupe) ;
                vm.formation_ml_repartition.date_formation  = new Date(vm.selectedItemFormation_ml_repartition.date_formation) ;
                vm.formation_ml_repartition.nbr_ml  = parseInt(vm.selectedItemFormation_ml_repartition.nbr_ml) ;
                vm.formation_ml_repartition.lieu_formation   = vm.selectedItemFormation_ml_repartition.lieu_formation ;
                vm.formation_ml_repartition.responsable = vm.selectedItemFormation_ml_repartition.responsable ;

                vm.affichage_masque_formation_ml_repartition=true;
            }

            vm.supprimerFormation_ml_repartition = function()
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

                    insert_in_baseFormation_ml_repartition(vm.selectedItemFormation_ml_repartition,1);
                }, function() {
                });
            }

            function insert_in_baseFormation_ml_repartition (formation_ml_repartition, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    var id_format_ml = vm.selectedItemFormation_ml.id ;
                    if (!NouvelItemFormation_ml_repartition) 
                    {
                        id = vm.selectedItemFormation_ml_repartition.id ;
                        id_format_ml=vm.selectedItemFormation_ml_repartition.id_formation_ml
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        num_groupe:formation_ml_repartition.num_groupe,
                        date_formation:convert_date(formation_ml_repartition.date_formation),
                        nbr_ml:formation_ml_repartition.nbr_ml,
                        lieu_formation:formation_ml_repartition.lieu_formation,
                        responsable:formation_ml_repartition.responsable,
                        id_formation_ml: id_format_ml             
                        
                    });

                    apiFactory.add("formation_ml_repartition/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFormation_ml_repartition) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                vm.selectedItemFormation_ml_repartition.num_groupe = formation_ml_repartition.num_groupe ;
                                vm.selectedItemFormation_ml_repartition.date_formation = new Date(formation_ml_repartition.date_formation) ;
                                vm.selectedItemFormation_ml_repartition.nbr_ml = formation_ml_repartition.nbr_ml ;
                                vm.selectedItemFormation_ml_repartition.lieu_formation = formation_ml_repartition.lieu_formation ;
                                vm.selectedItemFormation_ml_repartition.responsable = formation_ml_repartition.responsable ;                              
                            }
                            else
                            {
                                vm.allFormation_ml_repartition = vm.allFormation_ml_repartition.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFormation_ml_repartition.id ;
                                });
                            }

                        }
                        else
                        {   
                            var item =
                            {
                            id : String(data.response) ,
                            num_groupe : formation_ml_repartition.num_groupe ,
                            date_formation : new Date(formation_ml_repartition.date_formation) ,
                            nbr_ml : formation_ml_repartition.nbr_ml ,
                            lieu_formation : formation_ml_repartition.lieu_formation ,
                            responsable : formation_ml_repartition.responsable,
                            id_formation_ml: id_format_ml
                            }
                            vm.allFormation_ml_repartition.unshift(item) ;
					        
                        }
                        NouvelItemFormation_ml_repartition = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque_formation_ml_repartition=false;
                        vm.formation_ml_repartition = {};
                        vm.selectedItemFormation_ml_repartition ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFormation_ml_repartition (item,suppression)
            {
                console.log(item);
                console.log(currentItemFormation_ml_repartition);
                if (suppression!=1) 
                {                    
                    if((currentItemFormation_ml_repartition.num_groupe   != item.num_groupe )
                        ||(currentItemFormation_ml_repartition.date_formation   != convert_date(item.date_formation) )
                        ||(currentItemFormation_ml_repartition.nbr_ml    != item.nbr_ml )
                        ||(currentItemFormation_ml_repartition.lieu_formation != item.lieu_formation )
                        ||(currentItemFormation_ml_repartition.responsable != item.responsable )
                        )                    
                    { 
                            insert_in_baseFormation_ml_repartition(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseFormation_ml_repartition(item,suppression);		
            }
            //fin repartition groupe ml pour la formation

            //debut village participant 
            
            
            vm.filtre_village = function()
            {
                apiFactory.getAPIgeneraliserREST("formation_ml_repartition_village/index","menu","get_villageBycommune","id_commune",vm.filtre.id_commune).then(function(result)
                { 
                vm.all_village = result.data.response;            
                });
            }
            
            vm.click_formation_ml_repartition_village = function () 
            {
                vm.affiche_load = true ;
               apiFactory.getAPIgeneraliserREST("formation_ml_repartition_village/index","menu","get_repartition_villageByrepartition","id_formation_ml_repartition",vm.selectedItemFormation_ml_repartition.id).then(function(result){
                    vm.allFormation_ml_repartition_village = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allFormation_ml_repartition_village);
                }); 
                vm.selectedItemFormation_ml_repartition_village = {}; 
            }
            
            vm.formation_ml_repartition_village_column =[  
                                        {titre:"Village"},
                                        {titre:"Nombre de Mères/Pères leaders élus"}
                                    ];

                vm.selectionFormation_ml_repartition_village = function(item)
                {
                    vm.selectedItemFormation_ml_repartition_village = item ;

                    if (!vm.selectedItemFormation_ml_repartition_village.$edit) 
                    {
                        vm.nouvelItemFormation_ml_repartition_village = false ;  

                    }

                }

                $scope.$watch('vm.selectedItemFormation_ml_repartition_village', function()
                {
                    if (!vm.allFormation_ml_repartition_village) return;
                    vm.allFormation_ml_repartition_village.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemFormation_ml_repartition_village.$selected = true;

                });
               
                vm.ajouterFormation_ml_repartition_village = function()
                {
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_village : null
                        } ;

                    vm.nouvelItemFormation_ml_repartition_village = true ;                    

                    vm.allFormation_ml_repartition_village.unshift(item);
                    vm.allFormation_ml_repartition_village.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemFormation_ml_repartition_village = af;
                        
                      }
                    });
                }

                vm.modifierFormation_ml_repartition_village = function()
                {
                    vm.nouvelItemFormation_ml_repartition_village = false ;
                    vm.selectedItemFormation_ml_repartition_village.$edit = true;
                
                    current_selectedItemFormation_ml_repartition_village = angular.copy(vm.selectedItemFormation_ml_repartition_village);
                    vm.selectedItemFormation_ml_repartition_village.id_village = vm.selectedItemFormation_ml_repartition_village.village.id;
                    vm.selectedItemFormation_ml_repartition_village.nbr_ml_pl_elu = vm.selectedItemFormation_ml_repartition_village.village.nbr_ml_pl_elu;                  
                }

                vm.supprimerFormation_ml_repartition_village = function()
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

                    vm.enregistrerFormation_ml_repartition_village(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annulerFormation_ml_repartition_village = function()
                {
                    if (vm.nouvelItemFormation_ml_repartition_village) 
                    {
                        
                        vm.allFormation_ml_repartition_village.shift();
                        vm.selectedItemFormation_ml_repartition_village = {} ;
                        vm.nouvelItemFormation_ml_repartition_village = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemFormation_ml_repartition_village.$edit) //annuler selection
                        {
                            vm.selectedItemFormation_ml_repartition_village.$selected = false;
                            vm.selectedItemFormation_ml_repartition_village = {};
                        }
                        else
                        {
                            vm.selectedItemFormation_ml_repartition_village.$selected = false;
                            vm.selectedItemFormation_ml_repartition_village.$edit = false;
                            vm.selectedItemFormation_ml_repartition_village.id_village = current_selectedItemFormation_ml_repartition_village.village.id ;
                            
                            vm.selectedItemFormation_ml_repartition_village = {};
                        }

                        

                    }
                }

                vm.enregistrerFormation_ml_repartition_village = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };
                    var id_formation = vm.selectedItemFormation_ml_repartition.id;
                    if (vm.nouvelItemFormation_ml_repartition_village==false)
                    {
                        id_formation = vm.selectedItemFormation_ml_repartition_village.id_formation_ml_repartition;
                    }

                    var datas = $.param(
                    {                        
                        supprimer:etat_suppression,
                        id: vm.selectedItemFormation_ml_repartition_village.id,
                        id_village: vm.selectedItemFormation_ml_repartition_village.id_village,
                        id_formation_ml_repartition : id_formation 
                    });
                    console.log(datas);
                    apiFactory.add("formation_ml_repartition_village/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                      
                        if (!vm.nouvelItemFormation_ml_repartition_village) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                var vil = vm.all_village.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemFormation_ml_repartition_village.id_village;
                                });                             
                                
                                vm.selectedItemFormation_ml_repartition_village.village = vil[0];
                                vm.selectedItemFormation_ml_repartition_village.$edit = false ;
                                vm.selectedItemFormation_ml_repartition_village.$selected = false ;
                                vm.selectedItemFormation_ml_repartition_village = {} ;
                            }
                            else
                            {
                                vm.allFormation_ml_repartition_village = vm.allFormation_ml_repartition_village.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFormation_ml_repartition_village.id;
                                });

                                vm.selectedItemFormation_ml_repartition_village = {} ;
                            }

                        }
                        else
                        {   
                            
                            var vil = vm.all_village.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemFormation_ml_repartition_village.id_village;
                            });
                                                         
                            
                            vm.selectedItemFormation_ml_repartition_village.village = vil[0];
                            vm.selectedItemFormation_ml_repartition_village.$edit = false ;
                            vm.selectedItemFormation_ml_repartition_village.$selected = false ;
                            vm.selectedItemFormation_ml_repartition_village.id = String(data.response) ;
                            vm.selectedItemFormation_ml_repartition_village.id_formation_ml_repartition = id_formation;

                            vm.nouvelItemFormation_ml_repartition_village = false ;
                            vm.selectedItemFormation_ml_repartition_village = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }
                vm.change_village = function(item)
                {
                    var vil = vm.all_village.filter(function(obj)
                    {
                        return obj.id == item.id_village;
                    });
                    item.nbr_ml_pl_elu = vil[0].nbr_ml_pl_elu;

                }
            //Fin liste groupe participant
            //fin village participant

        
    }
})();

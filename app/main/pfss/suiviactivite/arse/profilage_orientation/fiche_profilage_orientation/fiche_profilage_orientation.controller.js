(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.profilage_orientation.fiche_profilage_orientation')
        .controller('Fiche_profilage_orientationController', Fiche_profilage_orientationController);

    /** @ngInject */
    function Fiche_profilage_orientationController(apiFactory, $state, $mdDialog, $scope,$cookieStore)
	{
		var vm = this;
		vm.dtOptions =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };
		vm.selectedItemFiche_profilage_orientation_entete = {};
		var NouvelItemFiche_profilage_orientation_entete=false;
        var currentItemFiche_profilage_orientation_entete;
		vm.fiche_profilage_orientation_entete = {};
        vm.allFiche_profilage_orientation_entete = [];

        vm.nouvelItemConnaissance_experiance_menage_entete = true;
        var currentItemConnaissance_experiance_menage_entete;
        vm.allConnaissance_experiance_menage_entete = {};
        vm.affichage_masque_connaissance_entete = false;
        vm.connaissance_experiance_menage_entete = {};

        
		vm.selectedItemConnaissance_experiance_menage_detail = {};
		var NouvelItemConnaissance_experiance_menage_detail=false;
        var currentItemConnaissance_experiance_menage_detail;
		vm.connaissance_experiance_menage_detail = {};
        vm.allConnaissance_experiance_menage_detail = [];

        
		vm.selectedItemFiche_profilage_ressource = {};
		var NouvelItemFiche_profilage_ressource=false;
        var currentItemFiche_profilage_ressource;
		vm.fiche_profilage_ressource = {};
        vm.allFiche_profilage_ressource = [];

		vm.selectedItemFiche_profilage_orientation = {};
		var NouvelItemFiche_profilage_orientation=false;
        var currentItemFiche_profilage_orientation;
		vm.fiche_profilage_orientation = {};
        vm.allFiche_profilage_orientation = [];
        
		vm.selectedItemFiche_profilage_besoin_formation = {};
		var NouvelItemFiche_profilage_besoin_formation=false;
        var currentItemFiche_profilage_besoin_formation;
		vm.fiche_profilage_besoin_formation = {};
        vm.allFiche_profilage_besoin_formation = [];

		apiFactory.getAll("Ile/index").then(function(result)
        {
            vm.all_ile = result.data.response;
        });
		apiFactory.getAll("agent_ex/index").then(function(result)
        {
            vm.allAgex = result.data.response;
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
		  });
		}
		
		vm.filtre_village = function()
		{
		  apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
		  { 
			vm.all_village = result.data.response;  
			vm.filtre.id_zip = null ; 
			vm.filtre.vague = null ;          
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
			apiFactory.getAPIgeneraliserREST("menage/index",'menu','menagebyvillage_withcomposition','id_village',vm.filtre.id_village).then(function(result) { 
              vm.allMenage = result.data.response;
              console.log(vm.allMenage);
          });
		}

		vm.get_fiche_profilage_orientation_entete = function()
      	{
          apiFactory.getAPIgeneraliserREST("fiche_profilage_orientation_entete/index","menu","getfiche_profilage_orientation_enteteByvillage",'id_village',vm.filtre.id_village).then(function(result) { 
              vm.allFiche_profilage_orientation_entete = result.data.response;
              console.log(vm.allFiche_profilage_orientation_entete);
          });           
          vm.selectedItemFiche_profilage_orientation_entete={};
      	}
            vm.fiche_profilage_orientation_entete_column = 
            [   
                {titre:"Date remplissage"},
                {titre:"Agex"},
                {titre:"Ménage"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemFiche_profilage_orientation_entete = item ;
                console.log(vm.selectedItemFiche_profilage_orientation_entete);
            }

            $scope.$watch('vm.selectedItemFiche_profilage_orientation_entete', function() {
                if (!vm.allFiche_profilage_orientation_entete) return;
                vm.allFiche_profilage_orientation_entete.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFiche_profilage_orientation_entete.$selected = true;
            });

            vm.ajoutFiche_profilage_orientation_entete = function(fiche_profilage_orientation_entete,suppression)
            {
                if (NouvelItemFiche_profilage_orientation_entete==false)
                {
                    test_existenceFiche_profilage_orientation_entete(fiche_profilage_orientation_entete,suppression); 
                }
                else
                {
                    insert_in_baseFiche_profilage_orientation_entete(fiche_profilage_orientation_entete,suppression);
                }
            }
            vm.ajouterFiche_profilage_orientation_entete = function ()
            {
                vm.selectedItemFiche_profilage_orientation_entete.$selected = false;
                NouvelItemFiche_profilage_orientation_entete = true ;
                vm.fiche_profilage_orientation_entete.supprimer=0;
                vm.fiche_profilage_orientation_entete.id=0;
                //vm.fiche_profilage_orientation_entete.numero=null;
                vm.fiche_profilage_orientation_entete.date_remplissage=null;
                vm.fiche_profilage_orientation_entete.id_agex=null;
                vm.fiche_profilage_orientation_entete.id_menage=null;
                vm.fiche_profilage_orientation_entete.materiel=null;
                //vm.formation_ml.id_commune=null;		
                vm.affichage_masque=true;
                vm.selectedItemFiche_profilage_orientation_entete = {};
            }
            vm.annulerFiche_profilage_orientation_entete = function()
            {
                vm.selectedItemFiche_profilage_orientation_entete={};
                vm.selectedItemFiche_profilage_orientation_entete.$selected = false;
                NouvelItemFiche_profilage_orientation_entete = false;
                vm.affichage_masque=false;
                vm.fiche_profilage_orientation_entete = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFiche_profilage_orientation_entete = function () 
            {
                NouvelItemFiche_profilage_orientation_entete = false;                
                currentItemFiche_profilage_orientation_entete = JSON.parse(JSON.stringify(vm.selectedItemFiche_profilage_orientation_entete));
                vm.fiche_profilage_orientation_entete.date_remplissage  =  new Date(vm.selectedItemFiche_profilage_orientation_entete.date_remplissage) ;
                vm.fiche_profilage_orientation_entete.id_agex   = vm.selectedItemFiche_profilage_orientation_entete.agex.id ;
                vm.fiche_profilage_orientation_entete.id_menage   = vm.selectedItemFiche_profilage_orientation_entete.menage.id ;
                vm.fiche_profilage_orientation_entete.id_village  = vm.selectedItemFiche_profilage_orientation_entete.id_village ;

                vm.affichage_masque=true;
            }

            vm.supprimerFiche_profilage_orientation_entete = function()
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

                    insert_in_baseFiche_profilage_orientation_entete(vm.selectedItemFiche_profilage_orientation_entete,1);
                }, function() {
                });
            }

            function insert_in_baseFiche_profilage_orientation_entete (fiche_profilage_orientation_entete, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
					var id_villa = vm.filtre.id_village ;
                    if (!NouvelItemFiche_profilage_orientation_entete) 
                    {
                        id = vm.selectedItemFiche_profilage_orientation_entete.id ;
						id_villa = vm.selectedItemFiche_profilage_orientation_entete.id_village ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:          etat_suppression,
                        id_agex:            fiche_profilage_orientation_entete.id_agex,
                        id_menage:   		fiche_profilage_orientation_entete.id_menage,
                        date_remplissage:  convert_date(fiche_profilage_orientation_entete.date_remplissage),
                        id_village:        id_villa         
                        
                    });

                    apiFactory.add("fiche_profilage_orientation_entete/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFiche_profilage_orientation_entete) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var mena = vm.allMenage.filter(function(obj)
                                {
                                    return obj.id == fiche_profilage_orientation_entete.id_menage  ;
                                });
                                if (mena.length!=0)
                                {                                  
                                    vm.selectedItemFiche_profilage_orientation_entete.menage = mena[0] ;  
                                }
                                
                                var age = vm.allAgex.filter(function(obj)
                                {
                                    return obj.id == fiche_profilage_orientation_entete.id_agex  ;
                                });
                                if (age.length!=0)
                                {                                  
                                    vm.selectedItemFiche_profilage_orientation_entete.agex = age[0] ;  
                                }
                                vm.selectedItemFiche_profilage_orientation_entete.id_village         = id_villa ;
                                vm.selectedItemFiche_profilage_orientation_entete.date_remplissage = new Date(fiche_profilage_orientation_entete.date_remplissage) ;                             
                            }
                            else
                            {
                                vm.allFiche_profilage_orientation_entete = vm.allFiche_profilage_orientation_entete.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFiche_profilage_orientation_entete.id ;
                                });
                            }

                        }
                        else
                        {   var agx = [];
                            var menag = [];
                            var mena = vm.allMenage.filter(function(obj)
                                {
                                    return obj.id == fiche_profilage_orientation_entete.id_menage  ;
                                });
                                if (mena.length!=0)
                                {                                  
                                    menag= mena[0] ;  
                                }
                                
                                var age = vm.allAgex.filter(function(obj)
                                {
                                    return obj.id == fiche_profilage_orientation_entete.id_agex  ;
                                });
                                if (age.length!=0)
                                {                                  
                                    agx = age[0] ;  
                                }
                            var item =
                            {
                            id :                        String(data.response) ,
                            agex :    agx ,
                            menage :    menag ,
                            id_village :                id_villa ,
                            date_remplissage :         new Date(fiche_profilage_orientation_entete.date_remplissage)
                            }
                            vm.allFiche_profilage_orientation_entete.unshift(item) ;
					        
                        }
                        NouvelItemFiche_profilage_orientation_entete = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.fiche_profilage_orientation_entete = {};
                        vm.selectedItemFiche_profilage_orientation_entete ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFiche_profilage_orientation_entete (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemFiche_profilage_orientation_entete.date_remplissage   != convert_date(item.date_remplissage) )
                        ||(currentItemFiche_profilage_orientation_entete.agex.id   != item.id_agex ) 
                        ||(currentItemFiche_profilage_orientation_entete.menage.id   != item.id_menage )
                        )                    
                    { 
                            insert_in_baseFiche_profilage_orientation_entete(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseFiche_profilage_orientation_entete(item,suppression);		
            }
			vm.affichage_situation_matrimoniale = function(situation)
			{	
				var affichage='--';
				switch (parseInt(situation))
				{
					case 1:
						affichage = 'célibataire';   //célibataire                  
						break;

					case 2:
						affichage = 'marié(e)';	//marié(e)				
						break;
					case 3:
						affichage = 'veuf(ve)';   //veuf(ve)                  
						break;

					case 4:
						affichage = 'divorcé(e)';	//divorcé(e)				
						break;
					default:
						break;
				}
				
				return affichage;
			}
			vm.affichage_inapte = function(inapte)
			{	
				var affichage='--';

				switch (parseInt(inapte))
				{
				case 1:
					affichage = 'Apte';   //apte                  
					break;

				case 2:
					affichage = 'Inapte';	//inapte				
					break;
				default:
					break;
				}
				
				return affichage;
			}


//Debut connaisssance experience menage entete
         
vm.click_connaissance_experiance_menage_entete = function () 
{
    vm.affiche_load = true ;
    vm.allConnaissance_experiance_menage_entete =[];
   apiFactory.getAPIgeneraliserREST("connaissance_experiance_menage_entete/index","cle_etrangere",vm.selectedItemFiche_profilage_orientation_entete.id).then(function(result){
        if (result.data.response.length!=0)
        {            
            vm.allConnaissance_experiance_menage_entete = result.data.response[0];
            vm.nouvelItemConnaissance_experiance_menage_entete = false; 
        }            
        apiFactory.getAPIgeneraliserREST("connaissance_experience_menage_detail/index","cle_etrangere",vm.selectedItemFiche_profilage_orientation_entete.id).then(function(result) { 
            vm.allConnaissance_experiance_menage_detail = result.data.response;
            console.log(vm.allConnaissance_experiance_menage_detail);       
            vm.affiche_load = false ;
        }); 
    }); 
    vm.selectedItemConnaissance_experiance_menage_entete = {}; 
}

   

    vm.modifierConnaissance_experiance_menage_entete = function()
    {   
        vm.affichage_masque_connaissance_entete = true;
        if (vm.nouvelItemConnaissance_experiance_menage_entete==true)
        {
            vm.connaissance_experiance_menage_entete.niveau_formation = null;
            vm.connaissance_experiance_menage_entete.autre_niveau_formation = null;
         
        }
        else
        {   
            currentItemConnaissance_experiance_menage_entete = angular.copy(vm.allConnaissance_experiance_menage_entete);
            vm.connaissance_experiance_menage_entete.niveau_formation = vm.allConnaissance_experiance_menage_entete.niveau_formation;
            vm.connaissance_experiance_menage_entete.autre_niveau_formation = vm.allConnaissance_experiance_menage_entete.autre_niveau_formation;
         
        }
                        
    }

    vm.annulerConnaissance_experiance_menage_entete = function()
    {           
        vm.affichage_masque_connaissance_entete = false;
        if (vm.nouvelItemConnaissance_experiance_menage_entete) 
        {            
            vm.allConnaissance_experiance_menage_entete={};
        }
        else
        {
            vm.allConnaissance_experiance_menage_entete = currentItemConnaissance_experiance_menage_entete;
        }
    }

    vm.enregistrerConnaissance_experiance_menage_entete = function(etat_suppression)
    {
        vm.affiche_load = true ;
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var get_id= 0;
        var autre_niveau = vm.connaissance_experiance_menage_entete.autre_niveau_formation;
        if (vm.nouvelItemConnaissance_experiance_menage_entete==false)
        {
            get_id = vm.allConnaissance_experiance_menage_entete.id;
        }
        if (parseInt(vm.connaissance_experiance_menage_entete.niveau_formation)!=4)
        {
            autre_niveau = null;
        }

        var datas = $.param(
        {                        
            supprimer:etat_suppression,
            id: get_id,  
            niveau_formation: vm.connaissance_experiance_menage_entete.niveau_formation,
            autre_niveau_formation: autre_niveau,
            id_fiche_profilage_orientation : vm.selectedItemFiche_profilage_orientation_entete.id 
        });
        console.log(datas);
        apiFactory.add("connaissance_experiance_menage_entete/index",datas, config).success(function (data)
        {
            vm.affiche_load = false ;
          
            if (!vm.nouvelItemConnaissance_experiance_menage_entete) 
            {                                   
                    vm.allConnaissance_experiance_menage_entete.niveau_formation = vm.connaissance_experiance_menage_entete.niveau_formation;
                    vm.allConnaissance_experiance_menage_entete.autre_niveau_formation = autre_niveau;                
            }
            else
            {   
                vm.allConnaissance_experiance_menage_entete.niveau_formation = vm.connaissance_experiance_menage_entete.niveau_formation;
                vm.allConnaissance_experiance_menage_entete.autre_niveau_formation = autre_niveau;                
       
                vm.allConnaissance_experiance_menage_entete.id = String(data.response) ;
                vm.nouvelItemConnaissance_experiance_menage_entete==false;
            }
               
            vm.affichage_masque_connaissance_entete = false;
        })
        .error(function (data) {alert("Une erreur s'est produit");});
    }
//Fin niveau formation du menage entete

//Debut niveau formation du menage detail

            vm.connaissance_experiance_menage_detail_column = 
            [   
                {titre:"Activités rélisées auparavant"},
                {titre:"Difficultés rencontrées"},
                {titre:"Nombre d'années d'actvités"},
                {titre:"Formation acquise"}
            ];                       

            vm.selectionConnaissance_experiance_menage_detail = function (item) 
            {
                vm.selectedItemConnaissance_experiance_menage_detail = item ;
                console.log(vm.selectedItemConnaissance_experiance_menage_detail);
            }

            $scope.$watch('vm.selectedItemConnaissance_experiance_menage_detail', function() {
                if (!vm.allConnaissance_experiance_menage_detail) return;
                vm.allConnaissance_experiance_menage_detail.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemConnaissance_experiance_menage_detail.$selected = true;
            });

            vm.ajoutConnaissance_experiance_menage_detail = function(connaissance_experiance_menage_detail,suppression)
            {
                if (NouvelItemConnaissance_experiance_menage_detail==false)
                {
                    test_existenceConnaissance_experiance_menage_detail(connaissance_experiance_menage_detail,suppression); 
                }
                else
                {
                    insert_in_baseConnaissance_experiance_menage_detail(connaissance_experiance_menage_detail,suppression);
                }
            }
           /* vm.ajouterConnaissance_experiance_menage_detail = function ()
            {
                vm.selectedItemConnaissance_experiance_menage_detail.$selected = false;
                NouvelItemConnaissance_experiance_menage_detail = true ;
                vm.connaissance_experiance_menage_detail.supprimer=0;
                vm.connaissance_experiance_menage_detail.id=0;
                //vm.connaissance_experiance_menage_detail.numero=null;
                vm.connaissance_experiance_menage_detail.date_remplissage=null;
                vm.connaissance_experiance_menage_detail.id_agex=null;
                vm.connaissance_experiance_menage_detail.id_menage=null;
                vm.connaissance_experiance_menage_detail.materiel=null;
                //vm.formation_ml.id_commune=null;		
                vm.affichage_masque=true;
                vm.selectedItemConnaissance_experiance_menage_detail = {};
            }*/
            vm.annulerConnaissance_experiance_menage_detail = function()
            {
                vm.selectedItemConnaissance_experiance_menage_detail={};
                vm.selectedItemConnaissance_experiance_menage_detail.$selected = false;
                NouvelItemConnaissance_experiance_menage_detail = false;
                vm.affichage_masque_connaissance_detail=false;
                vm.connaissance_experiance_menage_detail = {};
            };

            vm.modifConnaissance_experiance_menage_detail = function () 
            {
                
                if (vm.selectedItemConnaissance_experiance_menage_detail.id)
                {   
                    NouvelItemConnaissance_experiance_menage_detail = false;
                    console.log('mod');
                    vm.connaissance_experiance_menage_detail.id_activite_realise_auparavant_prevu   = vm.selectedItemConnaissance_experiance_menage_detail.id_activite_realise_auparavant_prevu ;
                    vm.connaissance_experiance_menage_detail.difficulte_rencontre   = vm.selectedItemConnaissance_experiance_menage_detail.difficulte_rencontre ;
                    vm.connaissance_experiance_menage_detail.nbr_annee_activite   = vm.selectedItemConnaissance_experiance_menage_detail.nbr_annee_activite ;
                    vm.connaissance_experiance_menage_detail.formation_acquise  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise ;
                    vm.connaissance_experiance_menage_detail.autre_activite_realise_auparavant  = vm.selectedItemConnaissance_experiance_menage_detail.autre_activite_realise_auparavant ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_mar  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_mar ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_pep  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_pep ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_cul  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_cul ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_tra_act1  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tra_act1 ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_tra_act3  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tra_act3 ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_cap  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_cap ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_avi  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_avi ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_bov  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_bov ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_tec  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tec ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_aut_act1  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act1 ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_aut_act2  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act2 ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_aut_act3  = vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act3 ;
                }
                else
                {   
                    console.log('nou');                    
                    NouvelItemConnaissance_experiance_menage_detail = true;
                    vm.connaissance_experiance_menage_detail.id_activite_realise_auparavant_prevu   = vm.selectedItemConnaissance_experiance_menage_detail.id_activite_realise_auparavant_prevu ;
                    vm.connaissance_experiance_menage_detail.difficulte_rencontre   = null ;
                    vm.connaissance_experiance_menage_detail.nbr_annee_activite   = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise  = null;
                    vm.connaissance_experiance_menage_detail.autre_activite_realise_auparavant  = null;
                    vm.connaissance_experiance_menage_detail.formation_acquise_pep  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_cul  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_tra_act1  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_tra_act3  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_cap  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_avi  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_bov  = null;
                    vm.connaissance_experiance_menage_detail.formation_acquise_tec  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_aut_act1  = null ;
                    vm.connaissance_experiance_menage_detail.formation_acquise_aut_act2  = null;
                    vm.connaissance_experiance_menage_detail.formation_acquise_aut_act3  = null ;
                }                
                currentItemConnaissance_experiance_menage_detail = JSON.parse(JSON.stringify(vm.selectedItemConnaissance_experiance_menage_detail));
                

                vm.affichage_masque_connaissance_detail=true;
            }

            vm.supprimerConnaissance_experiance_menage_detail = function()
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

                    insert_in_baseConnaissance_experiance_menage_detail(vm.selectedItemConnaissance_experiance_menage_detail,1);
                }, function() {
                });
            }

            function insert_in_baseConnaissance_experiance_menage_detail (connaissance_experiance_menage_detail, etat_suppression)
            {
                vm.affiche_load = true ;
                var tab=[];
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
					var id_villa = vm.filtre.id_village ;
                    if (!NouvelItemConnaissance_experiance_menage_detail) 
                    {
                        id = vm.selectedItemConnaissance_experiance_menage_detail.id ;
						id_villa = vm.selectedItemConnaissance_experiance_menage_detail.id_village ;
                    }
                    
                    if(connaissance_experiance_menage_detail.formation_acquise_mar == true)
                    {
                        tab.push('mar');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_pep == true)
                     {
                        tab.push('pep');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_cul == true)
                    {
                        tab.push('cul');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_tra_act1 == true)
                     {
                         tab.push('tra_act1');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_tra_act3 == true)
                     {
                         tab.push('tra_act3');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_cap == true)
                    {
                        tab.push('cap');
                    }
                    
                    if(connaissance_experiance_menage_detail.formation_acquise_avi == true)
                    {
                        tab.push('avi');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_bov == true)
                     {
                        tab.push('bov');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_tec == true)
                    {
                        tab.push('tec');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_aut_act1 == true)
                     {
                         tab.push('aut_act1');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_aut_act2 == true)
                    {
                        tab.push('aut_act2');
                    }
                    if(connaissance_experiance_menage_detail.formation_acquise_aut_act3 == true)
                    {
                        tab.push('aut_act3');
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:          etat_suppression,                        
                        id_activite_realise_auparavant: connaissance_experiance_menage_detail.id_activite_realise_auparavant_prevu,
                        id_fiche_profilage_orientation: vm.selectedItemFiche_profilage_orientation_entete.id,
                        difficulte_rencontre: connaissance_experiance_menage_detail.difficulte_rencontre,
                        nbr_annee_activite: connaissance_experiance_menage_detail.nbr_annee_activite,
                        formation_acquise: tab
                        
                    });

                    apiFactory.add("connaissance_experience_menage_detail/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemConnaissance_experiance_menage_detail) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                //vm.selectedItemConnaissance_experiance_menage_detail.id_activite_realise_auparavant = connaissance_experiance_menage_detail.id_activite_realise_auparavant_prevu ;
                                //vm.selectedItemConnaissance_experiance_menage_detail.id_fiche_profilage_orientation = vm.selectedItemFiche_profilage_orientation_entete.id ; 
                                vm.selectedItemConnaissance_experiance_menage_detail.difficulte_rencontre = connaissance_experiance_menage_detail.difficulte_rencontre ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.nbr_annee_activite = connaissance_experiance_menage_detail.nbr_annee_activite ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise = connaissance_experiance_menage_detail.formation_acquise ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_mar = connaissance_experiance_menage_detail.formation_acquise_mar ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_pep = connaissance_experiance_menage_detail.formation_acquise_pep ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_cul = connaissance_experiance_menage_detail.formation_acquise_cul ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tra_act1 = connaissance_experiance_menage_detail.formation_acquise_tra_act1 ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tra_act3 = connaissance_experiance_menage_detail.formation_acquise_tra_act3 ; 
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_cap = connaissance_experiance_menage_detail.formation_acquise_cap ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_avi = connaissance_experiance_menage_detail.formation_acquise_avi ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_bov = connaissance_experiance_menage_detail.formation_acquise_bov ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tec = connaissance_experiance_menage_detail.formation_acquise_tec ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act1 = connaissance_experiance_menage_detail.formation_acquise_aut_act1 ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act2 = connaissance_experiance_menage_detail.formation_acquise_aut_act2 ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act3 = connaissance_experiance_menage_detail.formation_acquise_aut_act3 ;                             
                            }
                            else
                            {
                                vm.allConnaissance_experiance_menage_detail = vm.allConnaissance_experiance_menage_detail.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemConnaissance_experiance_menage_detail.id ;
                                });
                            }

                        }
                        else
                        {   
                                vm.selectedItemConnaissance_experiance_menage_detail.id = String(data.response) ;
                                vm.selectedItemConnaissance_experiance_menage_detail.activite_realise_auparavant = true ;
                                vm.selectedItemConnaissance_experiance_menage_detail.id_activite_realise_auparavant = connaissance_experiance_menage_detail.id_activite_realise_auparavant_prevu ;
                                vm.selectedItemConnaissance_experiance_menage_detail.id_fiche_profilage_orientation = vm.selectedItemFiche_profilage_orientation_entete.id ; 
                                vm.selectedItemConnaissance_experiance_menage_detail.difficulte_rencontre = connaissance_experiance_menage_detail.difficulte_rencontre ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.nbr_annee_activite = connaissance_experiance_menage_detail.nbr_annee_activite ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise = connaissance_experiance_menage_detail.formation_acquise ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_mar = connaissance_experiance_menage_detail.formation_acquise_mar ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_pep = connaissance_experiance_menage_detail.formation_acquise_pep ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_cul = connaissance_experiance_menage_detail.formation_acquise_cul ;   
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tra_act1 = connaissance_experiance_menage_detail.formation_acquise_tra_act1 ; 
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tra_act3 = connaissance_experiance_menage_detail.formation_acquise_tra_act3 ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_cap = connaissance_experiance_menage_detail.formation_acquise_cap ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_avi = connaissance_experiance_menage_detail.formation_acquise_avi ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_bov = connaissance_experiance_menage_detail.formation_acquise_bov ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_tec = connaissance_experiance_menage_detail.formation_acquise_tec ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act1 = connaissance_experiance_menage_detail.formation_acquise_aut_act1 ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act2 = connaissance_experiance_menage_detail.formation_acquise_aut_act2 ;  
                                vm.selectedItemConnaissance_experiance_menage_detail.formation_acquise_aut_act3 = connaissance_experiance_menage_detail.formation_acquise_aut_act3 ;
					        
                        }
                        NouvelItemConnaissance_experiance_menage_detail = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque_connaissance_detail=false;
                        vm.connaissance_experiance_menage_detail = {};
                        vm.selectedItemConnaissance_experiance_menage_detail ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceConnaissance_experiance_menage_detail (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemConnaissance_experiance_menage_detail.difficulte_rencontre != item.difficulte_rencontre)  
                        ||(currentItemConnaissance_experiance_menage_detail.nbr_annee_activite != item.nbr_annee_activite)   
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_mar != item.formation_acquise_mar)   
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_pep != item.formation_acquise_pep)   
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_cul != item.difficulte_rencontre_cul)   
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_tra_act1 != item.formation_acquise_tra_act1)   
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_tra_act3 != item.formation_acquise_tra_act3)   
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_cap != item.difficulte_rencontre_cap)  
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_avi != item.formation_acquise_avi)  
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_bov != item.formation_acquise_bov)  
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_tec != item.formation_acquise_tec)  
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_aut_act1 != item.formation_acquise_aut_act1)  
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_aut_act2 != item.formation_acquise_aut_act2)  
                        ||(currentItemConnaissance_experiance_menage_detail.formation_acquise_aut_act3 != item.formation_acquise_aut_act3)
                        )                    
                    { 
                            insert_in_baseConnaissance_experiance_menage_detail(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseConnaissance_experiance_menage_detail(item,suppression);		
            }
            vm.affichage_nbr_annee_activite = function(item)
            {
                var affichage = '';
                if (item=='1')
                {
                    affichage = 'Moins 1 an'; 
                }
                if (item=='2')
                {
                    affichage = '1 an'; 
                }
                if (item=='3')
                {
                    affichage = '2 ans'; 
                }
                if (item=='4')
                {
                    affichage = 'Plus 3 ans'; 
                }
                return affichage;
            }


            //Debut ressource disponible

        vm.get_fiche_profilage_ressource = function()
      	{
          apiFactory.getAPIgeneraliserREST("fiche_profilage_ressource/index","menu","getfiche_profilage_ressourceByentete",'id_fiche_profilage_orientation',vm.selectedItemFiche_profilage_orientation_entete.id).then(function(result) { 
              vm.allFiche_profilage_ressource = result.data.response;
              console.log(vm.allFiche_profilage_ressource);
          });           
          vm.selectedItemFiche_profilage_ressource={};
      	}
            vm.fiche_profilage_ressource_column = 
            [   
                {titre:"Désignation"},
                {titre:"Quantité"},
                {titre:"Etat"}
            ];                       

            vm.selectionFiche_profilage_ressource = function (item) 
            {
                vm.selectedItemFiche_profilage_ressource = item ;
                console.log(vm.selectedItemFiche_profilage_ressource);
            }

            $scope.$watch('vm.selectedItemFiche_profilage_ressource', function() {
                if (!vm.allFiche_profilage_ressource) return;
                vm.allFiche_profilage_ressource.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFiche_profilage_ressource.$selected = true;
            });

            vm.ajoutFiche_profilage_ressource = function(fiche_profilage_ressource,suppression)
            {
                if (NouvelItemFiche_profilage_ressource==false)
                {
                    test_existenceFiche_profilage_ressource(fiche_profilage_ressource,suppression); 
                }
                else
                {
                    insert_in_baseFiche_profilage_ressource(fiche_profilage_ressource,suppression);
                }
            }
            vm.ajouterFiche_profilage_ressource = function ()
            {
                vm.selectedItemFiche_profilage_ressource.$selected = false;
                NouvelItemFiche_profilage_ressource = true ;
                vm.fiche_profilage_ressource.supprimer=0;
                vm.fiche_profilage_ressource.id=0;
                vm.fiche_profilage_ressource.designation=null;
                vm.fiche_profilage_ressource.etat=null;
                vm.fiche_profilage_ressource.quantite=null;		
                vm.affichage_masque_ressource_disponible=true;
                vm.selectedItemFiche_profilage_ressource = {};
            }
            vm.annulerFiche_profilage_ressource = function()
            {
                vm.selectedItemFiche_profilage_ressource={};
                vm.selectedItemFiche_profilage_ressource.$selected = false;
                NouvelItemFiche_profilage_ressource = false;
                vm.affichage_masque_ressource_disponible=false;
                vm.fiche_profilage_ressource = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFiche_profilage_ressource = function () 
            {
                NouvelItemFiche_profilage_ressource = false;                
                currentItemFiche_profilage_ressource = JSON.parse(JSON.stringify(vm.selectedItemFiche_profilage_ressource));
                vm.fiche_profilage_ressource.designation  =  vm.selectedItemFiche_profilage_ressource.designation ;
                vm.fiche_profilage_ressource.quantite   = parseFloat(vm.selectedItemFiche_profilage_ressource.quantite);
                vm.fiche_profilage_ressource.etat   = vm.selectedItemFiche_profilage_ressource.etat ;

                vm.affichage_masque_ressource_disponible=true;
            }

            vm.supprimerFiche_profilage_ressource = function()
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

                    insert_in_baseFiche_profilage_ressource(vm.selectedItemFiche_profilage_ressource,1);
                }, function() {
                });
            }

            function insert_in_baseFiche_profilage_ressource (fiche_profilage_ressource, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemFiche_profilage_ressource) 
                    {
                        id = vm.selectedItemFiche_profilage_ressource.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:      etat_suppression,
                        designation:    fiche_profilage_ressource.designation,
                        quantite:   	fiche_profilage_ressource.quantite,
                        etat:           fiche_profilage_ressource.etat,
                        id_fiche_profilage_orientation :vm.selectedItemFiche_profilage_orientation_entete.id        
                        
                    });

                    apiFactory.add("fiche_profilage_ressource/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFiche_profilage_ressource) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                vm.selectedItemFiche_profilage_ressource.designation = fiche_profilage_ressource.designation ; 
                                vm.selectedItemFiche_profilage_ressource.quantite = fiche_profilage_ressource.quantite ; 
                                vm.selectedItemFiche_profilage_ressource.etat = fiche_profilage_ressource.etat ;                             
                            }
                            else
                            {
                                vm.allFiche_profilage_ressource = vm.allFiche_profilage_ressource.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFiche_profilage_ressource.id ;
                                });
                            }

                        }
                        else
                        {   
                            var item =
                            {
                            id :         String(data.response) ,
                            designation :    fiche_profilage_ressource.designation ,
                            quantite :    fiche_profilage_ressource.quantite ,
                            etat :        fiche_profilage_ressource.etat 
                            }
                            vm.allFiche_profilage_ressource.unshift(item) ;
					        
                        }
                        NouvelItemFiche_profilage_ressource = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque_ressource_disponible=false;
                        vm.fiche_profilage_ressource = {};
                        vm.selectedItemFiche_profilage_ressource ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFiche_profilage_ressource (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemFiche_profilage_ressource.designation   != item.designation)
                        ||(currentItemFiche_profilage_ressource.quantite   != item.quantite ) 
                        ||(currentItemFiche_profilage_ressource.etat   != item.etat )
                        )                    
                    { 
                            insert_in_baseFiche_profilage_ressource(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseFiche_profilage_ressource(item,suppression);		
            }
            //Fin ressource disponible
            //Debut orientation

        vm.get_fiche_profilage_orientation = function()
      	{
          apiFactory.getAPIgeneraliserREST("fiche_profilage_orientation/index","menu","getfiche_profilage_orientationByentete",'id_fiche_profilage_orientation',vm.selectedItemFiche_profilage_orientation_entete.id).then(function(result) { 
              vm.allFiche_profilage_orientation = result.data.response;
              console.log(vm.allFiche_profilage_orientation);
          });           
          vm.selectedItemFiche_profilage_orientation={};
      	}
            vm.fiche_profilage_orientation_column = 
            [   
                {titre:"Activités"},
                {titre:"Types d'activités"},
                {titre:"Groupe"}
            ];                       

            vm.selectionFiche_profilage_orientation = function (item) 
            {
                vm.selectedItemFiche_profilage_orientation = item ;
                console.log(vm.selectedItemFiche_profilage_orientation);
            }

            $scope.$watch('vm.selectedItemFiche_profilage_orientation', function() {
                if (!vm.allFiche_profilage_orientation) return;
                vm.allFiche_profilage_orientation.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFiche_profilage_orientation.$selected = true;
            });

            vm.ajoutFiche_profilage_orientation = function(fiche_profilage_orientation,suppression)
            {
                if (NouvelItemFiche_profilage_orientation==false)
                {
                    test_existenceFiche_profilage_orientation(fiche_profilage_orientation,suppression); 
                }
                else
                {
                    insert_in_baseFiche_profilage_orientation(fiche_profilage_orientation,suppression);
                }
            }
            vm.ajouterFiche_profilage_orientation = function ()
            {
                vm.selectedItemFiche_profilage_orientation.$selected = false;
                NouvelItemFiche_profilage_orientation = true ;
                vm.fiche_profilage_orientation.supprimer=0;
                vm.fiche_profilage_orientation.id=0;
                vm.fiche_profilage_orientation.activite=null;
                vm.fiche_profilage_orientation.type_activite=null;
                vm.fiche_profilage_orientation.groupe=null;		
                vm.affichage_masque_orientation=true;
                vm.selectedItemFiche_profilage_orientation = {};
            }
            vm.annulerFiche_profilage_orientation = function()
            {
                vm.selectedItemFiche_profilage_orientation={};
                vm.selectedItemFiche_profilage_orientation.$selected = false;
                NouvelItemFiche_profilage_orientation = false;
                vm.affichage_masque_orientation=false;
                vm.fiche_profilage_orientation = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFiche_profilage_orientation = function () 
            {
                NouvelItemFiche_profilage_orientation = false;                
                currentItemFiche_profilage_orientation = JSON.parse(JSON.stringify(vm.selectedItemFiche_profilage_orientation));
                vm.fiche_profilage_orientation.activite  =  vm.selectedItemFiche_profilage_orientation.activite ;
                vm.fiche_profilage_orientation.type_activite   = vm.selectedItemFiche_profilage_orientation.type_activite;
                vm.fiche_profilage_orientation.groupe   = vm.selectedItemFiche_profilage_orientation.groupe ;

                vm.affichage_masque_orientation=true;
            }

            vm.supprimerFiche_profilage_orientation = function()
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

                    insert_in_baseFiche_profilage_orientation(vm.selectedItemFiche_profilage_orientation,1);
                }, function() {
                });
            }

            function insert_in_baseFiche_profilage_orientation (fiche_profilage_orientation, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemFiche_profilage_orientation) 
                    {
                        id = vm.selectedItemFiche_profilage_orientation.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:      etat_suppression,
                        activite:    fiche_profilage_orientation.activite,
                        type_activite:   	fiche_profilage_orientation.type_activite,
                        groupe:           fiche_profilage_orientation.groupe,
                        id_fiche_profilage_orientation :vm.selectedItemFiche_profilage_orientation_entete.id        
                        
                    });
console.log(datas);
                    apiFactory.add("fiche_profilage_orientation/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFiche_profilage_orientation) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                vm.selectedItemFiche_profilage_orientation.activite = fiche_profilage_orientation.activite ; 
                                vm.selectedItemFiche_profilage_orientation.type_activite = fiche_profilage_orientation.type_activite ; 
                                vm.selectedItemFiche_profilage_orientation.groupe = fiche_profilage_orientation.groupe ;                             
                            }
                            else
                            {
                                vm.allFiche_profilage_orientation = vm.allFiche_profilage_orientation.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFiche_profilage_orientation.id ;
                                });
                            }

                        }
                        else
                        {   
                            var item =
                            {
                            id :         String(data.response) ,
                            activite :    fiche_profilage_orientation.activite ,
                            type_activite :    fiche_profilage_orientation.type_activite ,
                            groupe :        fiche_profilage_orientation.groupe 
                            }
                            vm.allFiche_profilage_orientation.unshift(item) ;
					        
                        }
                        NouvelItemFiche_profilage_orientation = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque_orientation=false;
                        vm.fiche_profilage_orientation = {};
                        vm.selectedItemFiche_profilage_orientation ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFiche_profilage_orientation (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemFiche_profilage_orientation.activite   != item.activite)
                        ||(currentItemFiche_profilage_orientation.type_activite   != item.type_activite ) 
                        ||(currentItemFiche_profilage_orientation.groupe   != item.groupe )
                        )                    
                    { 
                            insert_in_baseFiche_profilage_orientation(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseFiche_profilage_orientation(item,suppression);		
            }
            vm.affichage_type_activite = function(item)
            {   var affichage = "";
                if (item)
                {
                    if (parseInt(item)==1)
                    {
                        affichage="Acivités productives";
                    }
                    if (parseInt(item)==2)
                    {
                        affichage="Formation";
                    }
                }
                return affichage;
            }
            //Fin orientation

            //Debut besoin formation
            apiFactory.getAll("theme_formation/index").then(function(result)
            {
                vm.allType_formation= result.data.response;
            });
        vm.get_fiche_profilage_besoin_formation = function()
        {
        apiFactory.getAPIgeneraliserREST("fiche_profilage_besoin_formation/index","menu","getfiche_profilage_besoin_formationByentete",'id_fiche_profilage_orientation',vm.selectedItemFiche_profilage_orientation_entete.id).then(function(result) { 
            vm.allFiche_profilage_besoin_formation = result.data.response;
            console.log(vm.allFiche_profilage_besoin_formation);
        });           
        vm.selectedItemFiche_profilage_besoin_formation={};
        }
          vm.fiche_profilage_besoin_formation_column = 
          [   
            {titre:"Type formation"},
              {titre:"Profile bénéficiaire"},
              {titre:"Objectif de la formation"},
              {titre:"Durée de la formation"}
          ];                       

          vm.selectionFiche_profilage_besoin_formation = function (item) 
          {
              vm.selectedItemFiche_profilage_besoin_formation = item ;
              console.log(vm.selectedItemFiche_profilage_besoin_formation);
          }

          $scope.$watch('vm.selectedItemFiche_profilage_besoin_formation', function() {
              if (!vm.allFiche_profilage_besoin_formation) return;
              vm.allFiche_profilage_besoin_formation.forEach(function(item) {
                  item.$selected = false;
              });
              vm.selectedItemFiche_profilage_besoin_formation.$selected = true;
          });

          vm.ajoutFiche_profilage_besoin_formation = function(fiche_profilage_besoin_formation,suppression)
          {
              if (NouvelItemFiche_profilage_besoin_formation==false)
              {
                  test_existenceFiche_profilage_besoin_formation(fiche_profilage_besoin_formation,suppression); 
              }
              else
              {
                  insert_in_baseFiche_profilage_besoin_formation(fiche_profilage_besoin_formation,suppression);
              }
          }
          vm.ajouterFiche_profilage_besoin_formation = function ()
          {
              vm.selectedItemFiche_profilage_besoin_formation.$selected = false;
              NouvelItemFiche_profilage_besoin_formation = true ;
              vm.fiche_profilage_besoin_formation.supprimer=0;
              vm.fiche_profilage_besoin_formation.id=0;
              vm.fiche_profilage_besoin_formation.id_type_formation=null;
              vm.fiche_profilage_besoin_formation.profile=null;
              vm.fiche_profilage_besoin_formation.objectif=null;
              vm.fiche_profilage_besoin_formation.duree=null;		
              vm.affichage_masque_ressource_disponible=true;
              vm.selectedItemFiche_profilage_besoin_formation = {};
          }
          vm.annulerFiche_profilage_besoin_formation = function()
          {
              vm.selectedItemFiche_profilage_besoin_formation={};
              vm.selectedItemFiche_profilage_besoin_formation.$selected = false;
              NouvelItemFiche_profilage_besoin_formation = false;
              vm.affichage_masque_ressource_disponible=false;
              vm.fiche_profilage_besoin_formation = {};
          };
          /*vm.ajout_contrat_agep = function () 
          {
              vm.contrat_agep.statu = "En cours";
              NouvelItemContrat_agep = true;
          }*/

          vm.modifFiche_profilage_besoin_formation = function () 
          {
              NouvelItemFiche_profilage_besoin_formation = false;                
              currentItemFiche_profilage_besoin_formation = JSON.parse(JSON.stringify(vm.selectedItemFiche_profilage_besoin_formation));
              vm.fiche_profilage_besoin_formation.id_type_formation  =  vm.selectedItemFiche_profilage_besoin_formation.type_formation.id ;
              vm.fiche_profilage_besoin_formation.duree   = parseFloat(vm.selectedItemFiche_profilage_besoin_formation.duree);
              vm.fiche_profilage_besoin_formation.objectif   = vm.selectedItemFiche_profilage_besoin_formation.objectif ;
              vm.fiche_profilage_besoin_formation.profile   = vm.selectedItemFiche_profilage_besoin_formation.profile ;

              vm.affichage_masque_ressource_disponible=true;
          }

          vm.supprimerFiche_profilage_besoin_formation = function()
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

                  insert_in_baseFiche_profilage_besoin_formation(vm.selectedItemFiche_profilage_besoin_formation,1);
              }, function() {
              });
          }

          function insert_in_baseFiche_profilage_besoin_formation (fiche_profilage_besoin_formation, etat_suppression)
          {
              vm.affiche_load = true ;
              var config = {
                      headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                      }
                  };

                  var id = 0 ;
                  if (!NouvelItemFiche_profilage_besoin_formation) 
                  {
                      id = vm.selectedItemFiche_profilage_besoin_formation.id ;
                  }

                  var datas = $.param(
                  {
                      
                      id:id,      
                      supprimer:      etat_suppression,
                      id_type_formation:    fiche_profilage_besoin_formation.id_type_formation,
                      profile:   	fiche_profilage_besoin_formation.profile,
                      objectif:           fiche_profilage_besoin_formation.objectif,
                      duree:           fiche_profilage_besoin_formation.duree,
                      id_fiche_profilage_orientation :vm.selectedItemFiche_profilage_orientation_entete.id        
                      
                  });

                  apiFactory.add("fiche_profilage_besoin_formation/index",datas, config).success(function (data)
                  {
                      if (!NouvelItemFiche_profilage_besoin_formation) 
                      {
                          if (etat_suppression == 0) 
                          {  
                            var typ_f = vm.allType_formation.filter(function(obj)
                            {
                                return obj.id == fiche_profilage_besoin_formation.id_type_formation ;
                            });
                              
                                vm.selectedItemFiche_profilage_besoin_formation.type_formation = typ_f[0] ; 
                              vm.selectedItemFiche_profilage_besoin_formation.profile = fiche_profilage_besoin_formation.profile ; 
                              vm.selectedItemFiche_profilage_besoin_formation.objectif = fiche_profilage_besoin_formation.objectif ; 
                              vm.selectedItemFiche_profilage_besoin_formation.duree = fiche_profilage_besoin_formation.duree ;                             
                          }
                          else
                          {
                              vm.allFiche_profilage_besoin_formation = vm.allFiche_profilage_besoin_formation.filter(function(obj)
                              {
                                  return obj.id !== vm.selectedItemFiche_profilage_besoin_formation.id ;
                              });
                          }

                      }
                      else
                      {   
                        var typ_f = vm.allType_formation.filter(function(obj)
                        {
                            return obj.id == fiche_profilage_besoin_formation.id_type_formation ;
                        });
                          var item =
                          {
                          id :         String(data.response) ,
                          type_formation :    typ_f[0] ,
                          profile :    fiche_profilage_besoin_formation.profile ,
                          objectif :        fiche_profilage_besoin_formation.objectif ,
                          duree :        fiche_profilage_besoin_formation.duree
                          }
                          vm.allFiche_profilage_besoin_formation.unshift(item) ;
                          
                      }
                      NouvelItemFiche_profilage_besoin_formation = false ;
                      vm.affiche_load = false ;
                      vm.affichage_masque_ressource_disponible=false;
                      vm.fiche_profilage_besoin_formation = {};
                      vm.selectedItemFiche_profilage_besoin_formation ={};
                  })
                  .error(function (data) {alert("Une erreur s'est produit");});
          }
          function test_existenceFiche_profilage_besoin_formation (item,suppression)
          {
              if (suppression!=1) 
              {                    
                  if((currentItemFiche_profilage_besoin_formation.type_formation.id   != item.id_type_formation)
                      ||(currentItemFiche_profilage_besoin_formation.profile   != item.profile ) 
                      ||(currentItemFiche_profilage_besoin_formation.objectif   != item.objectif )
                      ||(currentItemFiche_profilage_besoin_formation.duree   != item.duree )
                      )                    
                  { 
                          insert_in_baseFiche_profilage_besoin_formation(item,suppression);                      
                  }
                  else
                  { 
                      item.$selected=false;
                      item.$edit=false;
                  }
                  
              }
              else
              insert_in_baseFiche_profilage_besoin_formation(item,suppression);		
          }
          //Fin ressource disponible
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
	}
  })();

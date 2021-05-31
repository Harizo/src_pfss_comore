(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.gerer_pac')
        .controller('Gerer_pacController', Gerer_pacController);

    /** @ngInject */
    function Gerer_pacController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore)
	{		
		var vm = this;
		var id_utilisateur = $cookieStore.get('id');
    vm.serveur_central = serveur_central ;
    vm.ajoutPac = ajoutPac ;
		var NouvelItemPac=false;
		var currentItemPac;
		vm.selectedItemPac = {} ;
		vm.allPac = [] ;    
    vm.pac = {};

    vm.ajoutPac_detail = ajoutPac_detail ;
		var NouvelItemPac_detail=false;
		var currentItemPac_detail;
		vm.selectedItemPac_detail = {} ;
		vm.allPac_detail = [] ;    
    vm.pac_detail = {};
    //style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      order:[]          
    };
    /* ***************Debut pac*********************/
/*vm.click_pac = function()
{
  apiFactory.getAPIgeneraliserREST("pac/index","menu","getpacbyfiche","id_fiche_env",vm.selectedItemFiche_env.id).then(function(result)
 {
     vm.allPac= result.data.response ;
 });
}*/
apiFactory.getAll("ile/index").then(function(result){
  vm.allIle = result.data.response;
});
/*apiFactory.getAll("zip/index").then(function(result){
  vm.allZip = result.data.response;
});*/

apiFactory.getAll("pac/index").then(function(result){
  vm.allPac = result.data.response;
  console.log(vm.allPac);
});
apiFactory.getAll("type_agr/index").then(function(result){
  vm.allType_agr = result.data.response;
  console.log(vm.allType_agr);
});
  vm.change_ile = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.pac.id_ile).then(function(result)
        { 
          vm.allRegion = result.data.response;   
          vm.pac.id_region = null ; 
          vm.pac.id_commune = null ; 
          vm.pac.id_village = null ;
          vm.pac.id_zip = null ; 
          vm.pac.vague = null ;
          
        });

      }

      vm.change_region = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.pac.id_region).then(function(result)
        { 
          vm.allCommune = result.data.response; 
          vm.pac.id_commune = null ; 
          vm.pac.id_village = null ;
          vm.pac.id_zip = null ; 
          vm.pac.vague = null ;           
        });
      }
	  vm.change_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.pac.id_commune).then(function(result)
        { 
          vm.allVillage = result.data.response; 
          vm.pac.id_village = null ; 
          vm.pac.id_zip = null ; 
          vm.pac.vague = null ;          
        });
      }
	    vm.change_village = function()
      {
          vm.allZip=[];
          //item.id_communaute = null;
          
          /*apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
            vm.allCommunaute = result.data.response;
          });*/
          var vil = vm.allVillage.filter(function(obj)
          {
            return obj.id == vm.pac.id_village;
          });
          if (vil.length!=0)
          {
            if (vil[0].vague)
            {
            vm.pac.vague = vil[0].vague;
            }
            else
            {
            vm.pac.vague = null ; 
            }
            if (vil[0].zip)
            {
            apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
              vm.allZip.push(result.data.response);
              
              if (result.data.response)
              {
                vm.pac.id_zip = result.data.response.id;
              }
              else
              {
                vm.pac.id_zip = null;
              }
              
              });
            }
            else
            {
            vm.pac.id_zip = null ; 
            }

          }
          else
          {
          vm.pac.id_zip = null;
          vm.pac.vague = null ; 
          }
      }
vm.pac_column =[
  {titre:"Ile"},
  {titre:"Préfecture"},
  {titre:"Commune"},
  {titre:"Village"},
  {titre:"Zip"},
  {titre:"Vague"},
  {titre:"Type AGR"},
  {titre:"Libelle AGR"},
  {titre:"Milieu physique"},
  {titre:"Condition climatique"},
  {titre:"Difficulté socio-économique"},
  {titre:"Infrastructure publique et sociale"},
  {titre:"Analyse des problématiques"},
  {titre:"Identification et priorisation des ARSE"},
  {titre:"Marché locale et régional ARSE"},
  {titre:"Description des activités"},
  {titre:"Estimation des besoins"},
  {titre:"Etude économique"},
  {titre:"Structures d’appui"},
  {titre:"Impact environnementaux"},
  {titre:"Impact sociaux"}
  ];
  
  vm.selectionPac= function (item)
  {     
      vm.selectedItemPac = item;
  };
  $scope.$watch('vm.selectedItemPac', function()
  {
    if (!vm.allPac) return;
    vm.allPac.forEach(function(item)
    {
      item.$selected = false;
    });
    vm.selectedItemPac.$selected = true;
  });
  
  function ajoutPac(pac,suppression)
  {
                
      if (NouvelItemPac==false) 
      {
          test_existencePac (pac,suppression); 
      }
      else
      {
          insert_in_basePac(pac,suppression);
      }
  
  }
  vm.ajouterPac = function ()
        {
            vm.selectedItemPac.$selected = false;
            NouvelItemPac = true ;
            //vm.pac.supprimer          = 0,
            vm.pac.id                 = 0,
            vm.pac.milieu_physique    = null;
            vm.pac.condition_climatique= null;
            vm.pac.diffi_socio_eco    = null;
            vm.pac.infra_pub_soc      = null;
            vm.pac.analyse_pro        = null;
            vm.pac.identi_prio_arse   = null;
            vm.pac.marche_loc_reg_arse= null;
            vm.pac.description_activite= null;      
            vm.pac.estimation_besoin  = null;     
            vm.pac.etude_eco          = null;
            vm.pac.structure_appui    = null;
            vm.pac.impact_env         = null;
            vm.pac.impact_sociau      = null;     
            vm.pac.id_ile             = null;     
            vm.pac.id_region          = null;
            vm.pac.id_commune         = null;
            vm.pac.id_zip             = null;
            vm.pac.vague              = null;
            vm.pac.id_type_agr        = null;
            vm.pac.libelle            = null;
            vm.selectedItemPac = {};
            vm.affichage_masque=true;			
        };
        vm.annulerPac= function(item)
        { 
          vm.selectedItemPac.$selected = false;
          NouvelItemPac = false;
          vm.affichage_masque=false;
          vm.pac = {};
          vm.selectedItemPac={};  
       };
        vm.modifierPac = function(item)
        {
          NouvelItemPac = false ;			
          currentItemPac = angular.copy(vm.selectedItemPac);
          vm.pac.milieu_physique = vm.selectedItemPac.milieu_physique;
          vm.pac.condition_climatique         = vm.selectedItemPac.condition_climatique;
          vm.pac.diffi_socio_eco  = vm.selectedItemPac.diffi_socio_eco;      
          vm.pac.infra_pub_soc    = vm.selectedItemPac.infra_pub_soc;      
          vm.pac.analyse_pro  = vm.selectedItemPac.analyse_pro;           
          vm.pac.identi_prio_arse = parseInt(vm.selectedItemPac.identi_prio_arse);
          vm.pac.marche_loc_reg_arse         = vm.selectedItemPac.marche_loc_reg_arse;
          vm.pac.description_activite  = vm.selectedItemPac.description_activite;      
          vm.pac.estimation_besoin    = vm.selectedItemPac.estimation_besoin;      
          vm.pac.etude_eco  = vm.selectedItemPac.etude_eco;
          vm.pac.structure_appui = vm.selectedItemPac.structure_appui;
          vm.pac.impact_env         = vm.selectedItemPac.impact_env;
          vm.pac.impact_sociau  = vm.selectedItemPac.impact_sociau;      
          vm.pac.id_ile    = vm.selectedItemPac.ile.id;      
          vm.pac.id_region  = vm.selectedItemPac.region.id;
          vm.pac.id_commune = vm.selectedItemPac.commune.id;
          vm.pac.id_zip         = vm.selectedItemPac.zip.id;    
          vm.pac.libelle         = vm.selectedItemPac.libelle;
          if (vm.selectedItemPac.type_agr)
          {            
            vm.pac.id_type_agr    = vm.selectedItemPac.type_agr.id;
          }
          if (vm.selectedItemPac.village)
          {            
            vm.pac.id_village = vm.selectedItemPac.village.id;
            vm.pac.vague = vm.selectedItemPac.village.vague;
            apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.selectedItemPac.commune.id).then(function(result)
            {
              vm.allVillage=result.data.response;
            });
          }
          apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.selectedItemPac.ile.id).then(function(result)
          {
            vm.allRegion=result.data.response;
          });	
          
          apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.selectedItemPac.region.id).then(function(result)
          {
            vm.allCommune=result.data.response;
          });          
          
          apiFactory.getAPIgeneraliserREST("zip/index","cle_etrangere",vm.selectedItemPac.village.id).then(function(result)
          {
            vm.allZip=result.data.response;
          });                      
          vm.affichage_masque=true;
        };
        vm.supprimerPac = function()
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
            ajoutPac(vm.selectedItemPac,1);
          }, function() {
          });
        }
 
        function insert_in_basePac(entite,suppression)
        {  
              //add
              var config = {
                headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };
              var getId = 0;
              if (NouvelItemPac==false)
              {
                getId = vm.selectedItemPac.id; 
              } 
              
              var datas = $.param({
                supprimer:suppression,
                id:getId,      
                milieu_physique: entite.milieu_physique,      
                condition_climatique: entite.condition_climatique,      
                diffi_socio_eco: entite.diffi_socio_eco,
                infra_pub_soc: entite.infra_pub_soc,      
                analyse_pro: entite.analyse_pro,
                identi_prio_arse: entite.identi_prio_arse,      
                marche_loc_reg_arse: entite.marche_loc_reg_arse,      
                description_activite: entite.description_activite,
                estimation_besoin: entite.estimation_besoin,      
                etude_eco: entite.etude_eco,        
                structure_appui: entite.structure_appui,      
                impact_env: entite.impact_env,      
                impact_sociau: entite.impact_sociau,
                id_ile: entite.id_ile,      
                id_region: entite.id_region,
                id_commune: entite.id_commune,     
                id_zip: entite.id_zip,     
                id_village: entite.id_village,     
                id_type_agr: entite.id_type_agr,     
                libelle: entite.libelle
              }); 
              console.log(datas);   
              //factory
              apiFactory.add("pac/index",datas, config).success(function (data)
              {
              
                if (NouvelItemPac == false)
                {
                  // Update or delete: id exclu                   
                  if(suppression==0)
                  {
                    var il = vm.allIle.filter(function(obj) {
                      return obj.id == entite.id_ile;
                    });
                    var co = vm.allCommune.filter(function(obj) {
                      return obj.id == entite.id_commune;
                    });
                    var reg = vm.allRegion.filter(function(obj) {
                      return obj.id == entite.id_region;
                    });
                    var zp = vm.allZip.filter(function(obj) {
                      return obj.id == entite.id_zip;
                    });
                    var vil = vm.allVillage.filter(function(obj) {
                      return obj.id == entite.id_village;
                    });
                    var tp_agr = vm.allType_agr.filter(function(obj) {
                      return obj.id == entite.id_type_agr;
                    });    
                    vm.selectedItemPac.type_agr     = tp_agr[0];  
                    vm.selectedItemPac.ile     = il[0];      
                    vm.selectedItemPac.region  = reg[0];
                    vm.selectedItemPac.commune = co[0];
                    vm.selectedItemPac.zip     = zp[0];
                    vm.selectedItemPac.village = vil[0];
                    vm.selectedItemPac.milieu_physique           = entite.milieu_physique,      
                    vm.selectedItemPac.condition_climatique      = entite.condition_climatique,      
                    vm.selectedItemPac.diffi_socio_eco           = entite.diffi_socio_eco,
                    vm.selectedItemPac.infra_pub_soc             = entite.infra_pub_soc,      
                    vm.selectedItemPac.analyse_pro               = entite.analyse_pro,
                    vm.selectedItemPac.identi_prio_arse          = entite.identi_prio_arse,      
                    vm.selectedItemPac.marche_loc_reg_arse       = entite.marche_loc_reg_arse,      
                    vm.selectedItemPac.description_activite      = entite.description_activite,
                    vm.selectedItemPac.estimation_besoin         = entite.estimation_besoin,      
                    vm.selectedItemPac.etude_eco                 = entite.etude_eco,        
                    vm.selectedItemPac.structure_appui           = entite.structure_appui,      
                    vm.selectedItemPac.impact_env                = entite.impact_env,      
                    vm.selectedItemPac.impact_sociau             = entite.impact_sociau,     
                    vm.selectedItemPac.libelle                   = entite.libelle
                  }
                  else
                  {    
                    vm.allPac = vm.allPac.filter(function(obj) {
                      return obj.id !== vm.selectedItemPac.id;
                    });
                  }
                } 
                else
                {
                  var il = vm.allIle.filter(function(obj) {
                    return obj.id == entite.id_ile;
                  });
                  var co = vm.allCommune.filter(function(obj) {
                    return obj.id == entite.id_commune;
                  });
                  var reg = vm.allRegion.filter(function(obj) {
                    return obj.id == entite.id_region;
                  });
                  var zp = vm.allZip.filter(function(obj) {
                    return obj.id == entite.id_zip;
                  });
                  var vil = vm.allVillage.filter(function(obj) {
                    return obj.id == entite.id_village;
                  }); 
                  var tp_agr = vm.allType_agr.filter(function(obj) {
                    return obj.id == entite.id_type_agr;
                  });  
                  var item =
                  {
                    id: data.response,      
                    milieu_physique: entite.milieu_physique,      
                    condition_climatique: entite.condition_climatique,      
                    diffi_socio_eco: entite.diffi_socio_eco,
                    infra_pub_soc: entite.infra_pub_soc,      
                    analyse_pro: entite.analyse_pro,
                    identi_prio_arse: entite.identi_prio_arse,      
                    marche_loc_reg_arse: entite.marche_loc_reg_arse,      
                    description_activite: entite.description_activite,
                    estimation_besoin: entite.estimation_besoin,      
                    etude_eco: entite.etude_eco,        
                    structure_appui: entite.structure_appui,      
                    impact_env: entite.impact_env,      
                    impact_sociau: entite.impact_sociau,
                    ile: il[0],      
                    region: reg[0],
                    commune: co[0],     
                    zip: zp[0],     
                    village: vil[0],     
                    type_agr: tp_agr[0],     
                    libelle: entite.libelle
                  }
                  vm.allPac.unshift(item) ;
					        vm.selectedItemPac ={};
                }
                NouvelItemPac = false ;
                vm.affiche_load = false ;
                vm.affichage_masque=false;
                vm.pac = {};
              }).error(function (data) {
                vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
              });  
          }
        
        function test_existencePac (item,suppression)
        {
          if (suppression!=1) 
          {
              var pl = vm.allPac.filter(function(obj)
              {
                  return obj.id == currentItemPac.id;
              });

                  if((item.milieu_physique         !=currentItemPac.milieu_physique)
                      ||(item.condition_climatique !=currentItemPac.condition_climatique)
                      ||(item.diffi_socio_eco      !=currentItemPac.diffi_socio_eco)
                      ||(item.infra_pub_soc        !=currentItemPac.infra_pub_soc)
                      ||(item.analyse_pro          !=currentItemPac.analyse_pro)
                      ||(item.identi_prio_arse     != currentItemPac.identi_prio_arse)
                      ||(item.marche_loc_reg_arse  != currentItemPac.marche_loc_reg_arse)
                      ||(item.description_activite != currentItemPac.description_activite)      
                      ||(item.estimation_besoin    != currentItemPac.estimation_besoin)      
                      ||(item.etude_eco        != currentItemPac.etude_eco)
                      ||(item.structure_appui  != currentItemPac.structure_appui)
                      ||(item.impact_env       != currentItemPac.impact_env)
                      ||(item.impact_sociau    != currentItemPac.impact_sociau)      
                      ||(item.id_ile     != currentItemPac.ile.id)      
                      ||(item.id_region  != currentItemPac.region.id)
                      ||(item.id_commune != currentItemPac.commune.id)
                      ||(item.id_zip     != currentItemPac.zip.id)
                      ||(item.id_village     != currentItemPac.village.id)
                      ||(item.id_type_agr     != currentItemPac.type_agr.id)
                      ||(item.libelle     != currentItemPac.libelle))                    
                  { 
                      insert_in_basePac(item,suppression);
                  }
                  else
                  {
                      item.$selected=false;
                      item.$edit=false;
                      vm.showtab_calendrier = false;
                  }                    
              
            }
              else
                  insert_in_basePac(item,suppression);			
        }
  
 /* ***************Fin pac**********************/

  /* ***************Debut pac detail **********************/
  vm.pac_detail_column =[
    {titre:"Numero d'ordre"},
    {titre:"Les besoins"},
    {titre:"Durée"},
    {titre:"Coût"},
    {titre:"Calendrier de l'activité"}
    ];
    vm.click_pac_detail = function()
    {
      apiFactory.getAPIgeneraliserREST("pac_detail/index","menu","getpac_derailbypac","id_pac",vm.selectedItemPac.id).then(function(result)
    {
        vm.allPac_detail= result.data.response ;
    });
    vm.selectedItemPac_detail = {};
    }
    
    vm.selectionPac_detail= function (item)
    {     
        vm.selectedItemPac_detail = item;
    };
    $scope.$watch('vm.selectedItemPac_detail', function()
    {
      if (!vm.allPac_detail) return;
      vm.allPac_detail.forEach(function(item)
      {
        item.$selected = false;
      });
      vm.selectedItemPac_detail.$selected = true;
    });
    
    function ajoutPac_detail(pac_detail,suppression)
    {
                  
        if (NouvelItemPac_detail==false) 
        {
            test_existencePac_detail (pac_detail,suppression); 
        }
        else
        {
            insert_in_basePac_detail(pac_detail,suppression);
        }
    
    }
    vm.ajouterPac_detail = function ()
          {
              vm.selectedItemPac_detail.$selected = false;
              NouvelItemPac_detail = true ;
              //vm.pac.supprimer          = 0,
              vm.pac_detail.id                 = 0,
              vm.pac_detail.numero    = parseInt(vm.selectedItemPac.identi_prio_arse);
              vm.pac_detail.besoin= null;
              vm.pac_detail.duree    = null;
              vm.pac_detail.cout      = null;
              vm.pac_detail.calendrier_activite = null;
              vm.selectedItemPac_detail = {};
              vm.affichage_masque_detail=true;			
          };
          vm.annulerPac_detail= function(item)
          { 
            vm.selectedItemPac_detail.$selected = false;
            NouvelItemPac_detail = false;
            vm.affichage_masque_detail=false;
            vm.pac_detail = {};
            vm.selectedItemPac_detail={};  
         };
          vm.modifierPac_detail = function(item)
          {
            NouvelItemPac_detail = false ;			
            currentItemPac_detail = angular.copy(vm.selectedItemPac_detail);
            vm.pac_detail.numero  = parseInt(vm.selectedItemPac_detail.numero);
            vm.pac_detail.besoin  = vm.selectedItemPac_detail.besoin;
            vm.pac_detail.duree   = parseFloat(vm.selectedItemPac_detail.duree);      
            vm.pac_detail.cout    = parseFloat(vm.selectedItemPac_detail.cout);      
            vm.pac_detail.calendrier_activite  = vm.selectedItemPac_detail.calendrier_activite;                     
            vm.affichage_masque_detail=true;
          };
          vm.supprimerPac_detail = function()
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
              ajoutPac(vm.selectedItemPac_detail,1);
            }, function() {
            });
          }
   
          function insert_in_basePac_detail(entite,suppression)
          {  
                //add
                var config = {
                  headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                  }
                };
                var getId = 0;
                if (NouvelItemPac_detail==false)
                {
                  getId = vm.selectedItemPac_detail.id; 
                } 
                
                var datas = $.param({
                  supprimer:suppression,
                  id:getId,      
                  numero: entite.numero,      
                  besoin: entite.besoin,      
                  duree: entite.duree,     
                  cout: entite.cout,
                  calendrier_activite: entite.calendrier_activite,     
                  id_pac: vm.selectedItemPac.id
                }); 
                console.log(datas);   
                //factory
                apiFactory.add("pac_detail/index",datas, config).success(function (data)
                {
                
                  if (NouvelItemPac_detail == false)
                  {
                    // Update or delete: id exclu                   
                    if(suppression==0)
                    {  
                      vm.selectedItemPac_detail.numero           = entite.numero,      
                      vm.selectedItemPac_detail.besoin      = entite.besoin,      
                      vm.selectedItemPac_detail.duree           = entite.duree,
                      vm.selectedItemPac_detail.cout             = entite.cout,      
                      vm.selectedItemPac_detail.calendrier_activite               = entite.calendrier_activite
                    }
                    else
                    {    
                      vm.allPac_detail = vm.allPac_detail.filter(function(obj) {
                        return obj.id !== vm.selectedItemPac_detail.id;
                      });
                    }
                  } 
                  else
                  { 
                    var item =
                    {
                      id: data.response,      
                      numero: entite.numero,      
                      besoin: entite.besoin,      
                      duree: entite.duree,
                      cout: entite.cout,      
                      calendrier_activite: entite.calendrier_activite
                    }
                    vm.allPac_detail.unshift(item) ;
                    vm.selectedItemPac_detail ={};
                  }
                  NouvelItemPac_detail = false ;
                  vm.affiche_load = false ;
                  vm.affichage_masque_detail=false;
                  vm.pac_detail = {};
                }).error(function (data) {
                  vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
                });  
            }
          
          function test_existencePac_detail (item,suppression)
          {
            if (suppression!=1) 
            {  
                    if((item.numero    !=currentItemPac_detail.numero)
                        ||(item.besoin !=currentItemPac_detail.besoin)
                        ||(item.duree  !=currentItemPac_detail.duree)
                        ||(item.cout   !=currentItemPac_detail.cout)
                        ||(item.calendrier_activite !=currentItemPac_detail.calendrier_activite))                    
                    { 
                        insert_in_basePac_detail(item,suppression);
                    }
                    else
                    {
                        item.$selected=false;
                        item.$edit=false;
                    }                    
                
              }
                else
                    insert_in_basePac_detail(item,suppression);			
          }
  /* ***************Fin pac detail*********************/
	
    }
  })();

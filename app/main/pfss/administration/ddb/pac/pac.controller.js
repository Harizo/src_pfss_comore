(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.pac')
        .controller('PacController', PacController);

    /** @ngInject */
    function PacController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore)
	{		
		var vm = this;
		var id_utilisateur = $cookieStore.get('id');
    vm.serveur_central = serveur_central ;
    vm.ajoutPac = ajoutPac ;
		var NouvelItemPac=false;
		var currentItemPac;
		vm.selectedItemPac = {} ;
		vm.allPac = [] ;
    vm.showtab_calendrier = false;

    vm.ajoutCalendrier_activites = ajoutCalendrier_activites ;
		var NouvelItemCalendrier_activites=false;
		var currentItemCalendrier_activites;
		vm.selectedItemCalendrier_activites = {} ;
		vm.allCalendrier_activites = [] ;
    
    vm.ajoutTableau_recap_pac = ajoutTableau_recap_pac ;
		var NouvelItemTableau_recap_pac=false;
		var currentItemTableau_recap_pac;
		vm.selectedItemTableau_recap_pac = {} ;
		vm.allTableau_recap_pac = [] ;

    vm.ajoutActivite_agr = ajoutActivite_agr ;
		var NouvelItemActivite_agr=false;
		var currentItemActivite_agr;
		vm.selectedItemActivite_agr = {} ;
    vm.showtab_activite_agr= false;
    //style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true,
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
apiFactory.getAll("zip/index").then(function(result){
  vm.allZip = result.data.response;
});

apiFactory.getAll("pac/index").then(function(result){
  vm.allPac = result.data.response;
});
apiFactory.getAll("type_agr/index").then(function(result){
  vm.allType_agr = result.data.response;
  console.log(vm.allType_agr);
});
vm.pac_column =[
  {titre:"Ile"},
  {titre:"Region"},
  {titre:"Commune"},
  {titre:"Zip"},
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
  {titre:"Impact sociaux"},
  {titre:"Action"}
  ];
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
        id_zip: entite.id_zip
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
            vm.selectedItemPac.ile    = il[0];      
            vm.selectedItemPac.region  = reg[0];
            vm.selectedItemPac.commune = co[0];
            vm.selectedItemPac.zip         = zp[0];
 
            vm.selectedItemPac.$selected = false;
            vm.selectedItemPac.$edit = false;
            vm.selectedItemPac ={};
          } else {    
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
          entite.ile    = il[0];      
          entite.region  = reg[0];
          entite.commune = co[0];
          entite.zip         = zp[0];
          entite.id=data.response;	
          NouvelItemPac=false; 
        }
        entite.$selected=false;
        entite.$edit=false;
      }).error(function (data) {
        vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
      });  
        }
        vm.selectionPac= function (item)
        {     
            vm.selectedItemPac = item;
            if (item.$edit!=true)
            {
              vm.showtab_calendrier = true;
            }
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
        vm.ajouterPac = function ()
        {
            vm.selectedItemPac.$selected = false;
            NouvelItemPac = true ;
            var items =
            {
                $edit: true,
                $selected: true,
                supprimer:0,
                id: '0',
                milieu_physique: '',
                condition_climatique: '',
                diffi_socio_eco: '',
                infra_pub_soc: '',
                analyse_pro: '',
                identi_prio_arse: '',
                marche_loc_reg_arse: '',
                description_activite: '',      
                estimation_besoin: '',     
                etude_eco: '',
                structure_appui: '',
                impact_env: '',
                impact_sociau: '',     
                id_ile: '',     
                id_region: '',
                id_commune: '',
                id_zip: ''
            };
          vm.allPac.unshift(items);
 
          vm.allPac.forEach(function(it)
          {
              if(it.$selected==true)
              {
                vm.selectedItemPac = it;
              }
          });			
        };
        vm.annulerPac= function(item)
        { 
          if (NouvelItemPac == false)
          {
            item.$selected=false;
            item.$edit=false;
            NouvelItemPac = false;

            item.milieu_physique      = currentItemPac.milieu_physique;
            item.condition_climatique = currentItemPac.condition_climatique;
            item.diffi_socio_eco  = currentItemPac.diffi_socio_eco;      
            item.infra_pub_soc    = currentItemPac.infra_pub_soc;      
            item.analyse_pro      = currentItemPac.analyse_pro;
            item.identi_prio_arse = currentItemPac.identi_prio_arse;
            item.marche_loc_reg_arse  = currentItemPac.marche_loc_reg_arse;
            item.description_activite = currentItemPac.description_activite;      
            item.estimation_besoin    = currentItemPac.estimation_besoin;      
            item.etude_eco        = currentItemPac.etude_eco;
            item.structure_appui  = currentItemPac.structure_appui;
            item.impact_env       = currentItemPac.impact_env;
            item.impact_sociau  = currentItemPac.impact_sociau;      
            item.id_ile     = currentItemPac.id_ile;      
            item.id_region  = currentItemPac.id_region;
            item.id_commune = currentItemPac.id_commune;
            item.id_zip     = currentItemPac.id_zip;
          }
          else
          {
            vm.allPac = vm.allPac.filter(function(obj) {
              return obj.id !== vm.selectedItemPac.id;
            });
          }  
       };
        vm.modifierPac = function(item)
        {
          NouvelItemPac = false ;
          vm.selectedItemPac = item;			
          currentItemPac = angular.copy(vm.selectedItemPac);
          $scope.vm.allPac.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
 
          item.milieu_physique = vm.selectedItemPac.milieu_physique;
           item.condition_climatique         = vm.selectedItemPac.condition_climatique;
           item.diffi_socio_eco  = vm.selectedItemPac.diffi_socio_eco;      
           item.infra_pub_soc    = vm.selectedItemPac.infra_pub_soc;      
           item.analyse_pro  = vm.selectedItemPac.analyse_pro;           
            item.identi_prio_arse = vm.selectedItemPac.identi_prio_arse;
            item.marche_loc_reg_arse         = vm.selectedItemPac.marche_loc_reg_arse;
            item.description_activite  = vm.selectedItemPac.description_activite;      
            item.estimation_besoin    = vm.selectedItemPac.estimation_besoin;      
            item.etude_eco  = vm.selectedItemPac.etude_eco;
            item.structure_appui = vm.selectedItemPac.structure_appui;
            item.impact_env         = vm.selectedItemPac.impact_env;
            item.impact_sociau  = vm.selectedItemPac.impact_sociau;      
            item.id_ile    = vm.selectedItemPac.ile.id;      
            item.id_region  = vm.selectedItemPac.region.id;
            item.id_commune = vm.selectedItemPac.commune.id;
            item.id_zip         = vm.selectedItemPac.zip.id;
            vm.showtab_calendrier = false;       
          vm.selectedItemPac.$edit = true;
          apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.selectedItemPac.ile.id).then(function(result)
          {
            vm.allRegion=result.data.response;
          });	
          
          apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.selectedItemPac.region.id).then(function(result)
          {
            vm.allCommune=result.data.response;
          });
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
        function test_existencePac (item,suppression)
        {
          if (suppression!=1) 
          {
              var pl = vm.allPac.filter(function(obj)
              {
                  return obj.id == currentItemPac.id;
              });
              if(pl[0])
              {
                  if((pl[0].milieu_physique         !=currentItemPac.milieu_physique)
                      ||(pl[0].condition_climatique !=currentItemPac.condition_climatique)
                      ||(pl[0].diffi_socio_eco      !=currentItemPac.diffi_socio_eco)
                      ||(pl[0].infra_pub_soc        !=currentItemPac.infra_pub_soc)
                      ||(pl[0].analyse_pro          !=currentItemPac.analyse_pro)
                      ||(pl[0].identi_prio_arse     != currentItemPac.identi_prio_arse)
                      ||(pl[0].marche_loc_reg_arse  != currentItemPac.marche_loc_reg_arse)
                      ||(pl[0].description_activite != currentItemPac.description_activite)      
                      ||(pl[0].estimation_besoin    != currentItemPac.estimation_besoin)      
                      ||(pl[0].etude_eco        != currentItemPac.etude_eco)
                      ||(pl[0].structure_appui  != currentItemPac.structure_appui)
                      ||(pl[0].impact_env       != currentItemPac.impact_env)
                      ||(pl[0].impact_sociau    != currentItemPac.impact_sociau)      
                      ||(pl[0].id_ile     != currentItemPac.ile.id)      
                      ||(pl[0].id_region  != currentItemPac.region.id)
                      ||(pl[0].id_commune != currentItemPac.commune.id)
                      ||(pl[0].id_zip     != currentItemPac.zip.id))                    
                  { 
                      insert_in_basePac(item,suppression);
                  }
                  else
                  {
                      item.$selected=false;
                      item.$edit=false;
                  }                    
              }
            }
              else
                  insert_in_basePac(item,suppression);			
        }
        vm.modifierIle = function(fiche)
       {
         fiche.id_region = null;
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",fiche.id_ile).then(function(result)
        {
          vm.allRegion=result.data.response;
        });
       }
       vm.modifierRegion = function(fiche)
       {
         fiche.id_commune = null;
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",fiche.id_region).then(function(result)
        {
          vm.allCommune=result.data.response;
        });
       }
  
 /* ***************Fin pac**********************/

  /* ***************Debut calendrier*********************/
vm.click_calendrier_activites = function()
{
  apiFactory.getAPIgeneraliserREST("calendrier_activites/index","menu","getcalendrier_activitesbypac","id_pac",vm.selectedItemPac.id).then(function(result)
 {
     vm.allCalendrier_activites= result.data.response ;
 });
}

vm.calendrier_activites_column =[
  {titre:"Activite"},
  {titre:"Mois"},
  {titre:"Durrée"},
  {titre:"Action"}
  ];
 function ajoutCalendrier_activites(calendrier_activites,suppression)
 {
              
    if (NouvelItemCalendrier_activites==false) 
    {
        test_existenceCalendrier_activites (calendrier_activites,suppression); 
    }
    else
    {
        insert_in_baseCalendrier_activites(calendrier_activites,suppression);
    }
 
 }
 
 function insert_in_baseCalendrier_activites(entite,suppression)
 {  
      //add
      var config = {
        headers : {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      };
      var getId = 0;
      if (NouvelItemCalendrier_activites==false)
      {
         getId = vm.selectedItemCalendrier_activites.id; 
      } 
      
      var datas = $.param({
        supprimer:suppression,
        id:getId,      
        activite: entite.activite,      
        mois: entite.mois,      
        duree: entite.duree,
        id_pac:vm.selectedItemPac.id
      }); 
      console.log(datas);   
      //factory
      apiFactory.add("calendrier_activites/index",datas, config).success(function (data)
      {
       
        if (NouvelItemCalendrier_activites == false)
        {
          // Update or delete: id exclu                   
          if(suppression==0)
          {  
            vm.selectedItemCalendrier_activites.$selected = false;
            vm.selectedItemCalendrier_activites.$edit = false;
            vm.selectedItemCalendrier_activites ={};
          } else {    
            vm.allCalendrier_activites = vm.allCalendrier_activites.filter(function(obj) {
              return obj.id !== vm.selectedItemCalendrier_activites.id;
            });
          }
        } 
        else
        {
          entite.id=data.response;	
          NouvelItemCalendrier_activites=false; 
        }
        entite.$selected=false;
        entite.$edit=false;
        vm.selectedItemCalendrier_activites ={};
      }).error(function (data) {
        vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
      });  
        }
        vm.selectionCalendrier_activites= function (item)
        {     
            vm.selectedItemCalendrier_activites = item;
            if (item.$edit!=true)
            {
              vm.showtab_calendrier = true;
            }
        };
        $scope.$watch('vm.selectedItemCalendrier_activites', function()
        {
          if (!vm.allCalendrier_activites) return;
          vm.allCalendrier_activites.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selectedItemCalendrier_activites.$selected = true;
      });
        vm.ajouterCalendrier_activites = function ()
        {
            vm.selectedItemCalendrier_activites.$selected = false;
            NouvelItemCalendrier_activites = true ;
            var items =
            {
                $edit: true,
                $selected: true,
                supprimer:0,
                id: '0',
                activite: '',
                mois: '',
                duree: ''
            };
          vm.allCalendrier_activites.unshift(items);
 
          vm.allCalendrier_activites.forEach(function(it)
          {
              if(it.$selected==true)
              {
                vm.selectedItemCalendrier_activites = it;
              }
          });			
        };
        vm.annulerCalendrier_activites= function(item)
        { 
          if (NouvelItemCalendrier_activites == false)
          {
            item.$selected=false;
            item.$edit=false;
            NouvelItemCalendrier_activites = false;

            item.activite      = currentItemCalendrier_activites.activite;
            item.mois = currentItemCalendrier_activites.mois;
            item.duree  = currentItemCalendrier_activites.duree;   
          }
          else
          {
            vm.allCalendrier_activites = vm.allCalendrier_activites.filter(function(obj) {
              return obj.id !== vm.selectedItemCalendrier_activites.id;
            });
          }  
       };
        vm.modifierCalendrier_activites = function(item)
        {
          NouvelItemCalendrier_activites = false ;
          vm.selectedItemCalendrier_activites = item;			
          currentItemCalendrier_activites = angular.copy(vm.selectedItemCalendrier_activites);
          $scope.vm.allCalendrier_activites.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
 
          item.activite = vm.selectedItemCalendrier_activites.activite;
           item.mois         = parseInt(vm.selectedItemCalendrier_activites.mois) ;
           item.duree  = parseFloat(vm.selectedItemCalendrier_activites.duree) ;         
          vm.selectedItemCalendrier_activites.$edit = true;
        };
        vm.supprimerCalendrier_activites = function()
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
            ajoutCalendrier_activites(vm.selectedItemCalendrier_activites,1);
          }, function() {
          });
        }
        function test_existenceCalendrier_activites (item,suppression)
        {
          if (suppression!=1) 
          {
              var pl = vm.allCalendrier_activites.filter(function(obj)
              {
                  return obj.id == currentItemCalendrier_activites.id;
              });
              if(pl[0])
              {
                  if((pl[0].activite         !=currentItemCalendrier_activites.activite)
                      ||(pl[0].mois !=currentItemCalendrier_activites.mois)
                      ||(pl[0].duree      !=currentItemCalendrier_activites.duree))                    
                  { 
                      insert_in_baseCalendrier_activites(item,suppression);
                  }
                  else
                  {
                      item.$selected=false;
                      item.$edit=false;
                  }                    
              }
            }
              else
                  insert_in_baseCalendrier_activites(item,suppression);			
        }
  
 /* ***************Fin Calendrier_activites**********************/

  /* ***************Debut tableau recapitulatif*********************/
  vm.click_tableau_recap_pac = function()
  {
    apiFactory.getAPIgeneraliserREST("tableau_recap_pac/index","menu","gettableau_recap_pacbypac","id_pac",vm.selectedItemPac.id).then(function(result)
   {
       vm.allTableau_recap_pac= result.data.response ;
   });
  }
  
  vm.tableau_recap_pac_column =[
    {titre:"Les besoins"},
    {titre:"Durée"},
    {titre:"Le cout"},
    {titre:"Action"}
    ];
   function ajoutTableau_recap_pac(tableau_recap_pac,suppression)
   {
                
      if (NouvelItemTableau_recap_pac==false) 
      {
          test_existenceTableau_recap_pac (tableau_recap_pac,suppression); 
      }
      else
      {
          insert_in_baseTableau_recap_pac(tableau_recap_pac,suppression);
      }
   
   }
   
   function insert_in_baseTableau_recap_pac(entite,suppression)
   {  
        //add
        var config = {
          headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
          }
        };
        var getId = 0;
        if (NouvelItemTableau_recap_pac==false)
        {
           getId = vm.selectedItemTableau_recap_pac.id; 
        } 
        
        var datas = $.param({
          supprimer:suppression,
          id:getId,      
          besoin: entite.besoin,      
          cout: entite.cout,      
          duree: entite.duree,
          id_pac:vm.selectedItemPac.id
        }); 
        console.log(datas);   
        //factory
        apiFactory.add("tableau_recap_pac/index",datas, config).success(function (data)
        {
         
          if (NouvelItemTableau_recap_pac == false)
          {
            // Update or delete: id exclu                   
            if(suppression==0)
            {  
              vm.selectedItemTableau_recap_pac.$selected = false;
              vm.selectedItemTableau_recap_pac.$edit = false;
              vm.selectedItemTableau_recap_pac ={};
            } else {    
              vm.allTableau_recap_pac = vm.allTableau_recap_pac.filter(function(obj) {
                return obj.id !== vm.selectedItemTableau_recap_pac.id;
              });
            }
          } 
          else
          {
            entite.id=data.response;	
            NouvelItemTableau_recap_pac=false; 
          }
          entite.$selected=false;
          entite.$edit=false;
          vm.selectedItemTableau_recap_pac ={};
        }).error(function (data) {
          vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
        });  
          }
          vm.selectionTableau_recap_pac= function (item)
          {     
              vm.selectedItemTableau_recap_pac = item;
              if (item.$edit!=true)
              {
                vm.showtab_activite_agr= true;
              }
          };
          $scope.$watch('vm.selectedItemTableau_recap_pac', function()
          {
            if (!vm.allTableau_recap_pac) return;
            vm.allTableau_recap_pac.forEach(function(item)
            {
              item.$selected = false;
            });
            vm.selectedItemTableau_recap_pac.$selected = true;
        });
          vm.ajouterTableau_recap_pac = function ()
          {
              vm.selectedItemTableau_recap_pac.$selected = false;
              NouvelItemTableau_recap_pac = true ;
              var items =
              {
                  $edit: true,
                  $selected: true,
                  supprimer:0,
                  id: '0',
                  besoin: '',
                  cout: '',
                  duree: ''
              };
            vm.allTableau_recap_pac.unshift(items);
   
            vm.allTableau_recap_pac.forEach(function(it)
            {
                if(it.$selected==true)
                {
                  vm.selectedItemTableau_recap_pac = it;
                }
            });			
          };
          vm.annulerTableau_recap_pac= function(item)
          { 
            if (NouvelItemTableau_recap_pac == false)
            {
              item.$selected=false;
              item.$edit=false;
              NouvelItemTableau_recap_pac = false;
  
              item.besoin      = currentItemTableau_recap_pac.besoin;
              item.cout = currentItemTableau_recap_pac.cout;
              item.duree  = currentItemTableau_recap_pac.duree;   
            }
            else
            {
              vm.allTableau_recap_pac = vm.allTableau_recap_pac.filter(function(obj) {
                return obj.id !== vm.selectedItemTableau_recap_pac.id;
              });
            }  
         };
          vm.modifierTableau_recap_pac = function(item)
          {
            NouvelItemTableau_recap_pac = false ;
            vm.selectedItemTableau_recap_pac = item;			
            currentItemTableau_recap_pac = angular.copy(vm.selectedItemTableau_recap_pac);
            $scope.vm.allTableau_recap_pac.forEach(function(it)
            {
              it.$edit = false;
            });        
            item.$edit = true;	
            item.$selected = true;	
   
              item.besoin = vm.selectedItemTableau_recap_pac.besoin;
              item.cout         = parseFloat(vm.selectedItemTableau_recap_pac.cout) ;
              item.duree  = parseFloat(vm.selectedItemTableau_recap_pac.duree) ;         
            vm.selectedItemTableau_recap_pac.$edit = true;
            vm.showtab_activite_agr= false;
          };
          vm.supprimerTableau_recap_pac = function()
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
              ajoutTableau_recap_pac(vm.selectedItemTableau_recap_pac,1);
            }, function() {
            });
          }
          function test_existenceTableau_recap_pac (item,suppression)
          {
            if (suppression!=1) 
            {
                var pl = vm.allTableau_recap_pac.filter(function(obj)
                {
                    return obj.id == currentItemTableau_recap_pac.id;
                });
                if(pl[0])
                {
                    if((pl[0].besoin         !=currentItemTableau_recap_pac.besoin)
                        ||(pl[0].cout !=currentItemTableau_recap_pac.cout)
                        ||(pl[0].duree      !=currentItemTableau_recap_pac.duree))                    
                    { 
                        insert_in_baseTableau_recap_pac(item,suppression);
                    }
                    else
                    {
                        item.$selected=false;
                        item.$edit=false;
                    }                    
                }
              }
                else
                    insert_in_baseTableau_recap_pac(item,suppression);			
          }
    
   /* ***************Fin Tableau_recap_pac**********************/	
   
  /* ***************Debut Activite_agr*********************/
  vm.click_activite_agr = function()
  {
    apiFactory.getAPIgeneraliserREST("activite_agr/index","menu","getactivite_agrbytableau_recap","id_tableau_recap_pac",vm.selectedItemTableau_recap_pac.id).then(function(result)
   {
       vm.allActivite_agr= result.data.response ;
   });
  }
  
  vm.activite_agr_column =[
    {titre:"Type AGR"},
    {titre:"Code"},
    {titre:"Libelle"},
    {titre:"Action"}
    ];
   function ajoutActivite_agr(activite_agr,suppression)
   {
                
      if (NouvelItemActivite_agr==false) 
      {
          test_existenceActivite_agr (activite_agr,suppression); 
      }
      else
      {
          insert_in_baseActivite_agr(activite_agr,suppression);
      }
   
   }
   
   function insert_in_baseActivite_agr(entite,suppression)
   {  
        //add
        var config = {
          headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
          }
        };
        var getId = 0;
        if (NouvelItemActivite_agr==false)
        {
           getId = vm.selectedItemActivite_agr.id; 
        } 
        
        var datas = $.param({
          supprimer:suppression,
          id:getId,      
          id_type_agr: entite.id_type_agr,      
          code: entite.code,      
          libelle: entite.libelle,
          id_tableau_recap_pac:vm.selectedItemTableau_recap_pac.id
        }); 
        console.log(datas);   
        //factory
        apiFactory.add("activite_agr/index",datas, config).success(function (data)
        {
         
          if (NouvelItemActivite_agr == false)
          {
            // Update or delete: id exclu                   
            if(suppression==0)
            {  
              var typ = vm.allType_agr.filter(function(obj) {
                return obj.id == entite.id_type_agr;
              });
              vm.selectedItemActivite_agr.type_agr = typ[0];
              vm.selectedItemActivite_agr.$selected = false;
              vm.selectedItemActivite_agr.$edit = false;
              vm.selectedItemActivite_agr ={};
            } else {    
              vm.allActivite_agr = vm.allActivite_agr.filter(function(obj) {
                return obj.id !== vm.selectedItemActivite_agr.id;
              });
            }
          } 
          else
          { 
            var typ = vm.allType_agr.filter(function(obj) {
              return obj.id == entite.id_type_agr;
            });
           entite.type_agr = typ[0];
            entite.id=data.response;	
            NouvelItemActivite_agr=false; 
          }
          entite.$selected=false;
          entite.$edit=false;
          vm.selectedItemActivite_agr ={};
        }).error(function (data) {
          vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
        });  
          }
          vm.selectionActivite_agr= function (item)
          {     
              vm.selectedItemActivite_agr = item;
              if (item.$edit!=true)
              {
                vm.showtab_calendrier = true;
              }
          };
          $scope.$watch('vm.selectedItemActivite_agr', function()
          {
            if (!vm.allActivite_agr) return;
            vm.allActivite_agr.forEach(function(item)
            {
              item.$selected = false;
            });
            vm.selectedItemActivite_agr.$selected = true;
        });
          vm.ajouterActivite_agr = function ()
          {
              vm.selectedItemActivite_agr.$selected = false;
              NouvelItemActivite_agr = true ;
              var items =
              {
                  $edit: true,
                  $selected: true,
                  supprimer:0,
                  id: '0',
                  id_type_agr: '',
                  code: '',
                  libelle: ''
              };
            vm.allActivite_agr.unshift(items);
   
            vm.allActivite_agr.forEach(function(it)
            {
                if(it.$selected==true)
                {
                  vm.selectedItemActivite_agr = it;
                }
            });			
          };
          vm.annulerActivite_agr= function(item)
          { 
            if (NouvelItemActivite_agr == false)
            {
              item.$selected=false;
              item.$edit=false;
              NouvelItemActivite_agr = false;
  
              item.id_type_agr      = currentItemActivite_agr.type_agr.id;
              item.code = currentItemActivite_agr.code;
              item.libelle  = currentItemActivite_agr.libelle;   
            }
            else
            {
              vm.allActivite_agr = vm.allActivite_agr.filter(function(obj) {
                return obj.id !== vm.selectedItemActivite_agr.id;
              });
            }  
         };
          vm.modifierActivite_agr = function(item)
          {
            NouvelItemActivite_agr = false ;
            vm.selectedItemActivite_agr = item;			
            currentItemActivite_agr = angular.copy(vm.selectedItemActivite_agr);
            $scope.vm.allActivite_agr.forEach(function(it)
            {
              it.$edit = false;
            });        
            item.$edit = true;	
            item.$selected = true;	
   
              item.id_type_agr = vm.selectedItemActivite_agr.type_agr.id;
              item.code         = vm.selectedItemActivite_agr.code ;
              item.libelle  = vm.selectedItemActivite_agr.libelle ;         
            vm.selectedItemActivite_agr.$edit = true;
          };
          vm.supprimerActivite_agr = function()
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
              ajoutActivite_agr(vm.selectedItemActivite_agr,1);
            }, function() {
            });
          }
          function test_existenceActivite_agr (item,suppression)
          {
            if (suppression!=1) 
            {
                var pl = vm.allActivite_agr.filter(function(obj)
                {
                    return obj.id == currentItemActivite_agr.id;
                });
                if(pl[0])
                {
                    if((pl[0].id_type_agr         !=currentItemActivite_agr.type_agr.id)
                        ||(pl[0].code !=currentItemActivite_agr.code)
                        ||(pl[0].libelle      !=currentItemActivite_agr.libelle))                    
                    { 
                        insert_in_baseActivite_agr(item,suppression);
                    }
                    else
                    {
                        item.$selected=false;
                        item.$edit=false;
                    }                    
                }
              }
                else
                    insert_in_baseActivite_agr(item,suppression);			
          }
    
   /* ***************Fin Activite_agr**********************/		
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
    }
  })();

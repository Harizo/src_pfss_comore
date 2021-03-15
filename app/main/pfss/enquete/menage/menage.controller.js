(function ()
{
    'use strict';
    angular
        .module('app.pfss.enquete.menages')
        .controller('MenagesController', MenagesController);

    /** @ngInject */
    function MenagesController(apiFactory, $state, $mdDialog, $scope, serveur_central) {
		var vm = this;
    vm.serveur_central = serveur_central ;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.menage_column = [{titre:"Numero d'enregistrement"},{titre:"Chef Ménage"},
      {titre:"Age chef de ménage"},{titre:"Sexe"},{titre:"Addresse"},{titre:"Personne inscrire"},{titre:"Etat envoie"}];
      vm.individu_column = [{titre:"Nom"},{titre:"Date de naissance"},{titre:"Activité"},{titre:"Sexe"},{titre:"Etat envoie"}];

      //initialisation variable
        vm.affiche_load = false ;
        vm.selectedItem = {} ;
        vm.selectedItem_individu = {} ;
        vm.tab_reponse_source_eau = [] ;
        vm.tab_reponse_bien_equipement = [] ;
        vm.tab_reponse_revetement_sol = [] ;
        vm.tab_reponse_revetement_toit = [] ;
        vm.tab_reponse_revetement_mur = [] ;
        vm.tab_reponse_type_culture = [] ;
        vm.tab_reponse_type_elevage = [] ;
        vm.tab_reponse_vaccin = [] ;
        vm.tab_programme = [] ;//liste programme associé au menage
        vm.tab_programme_individu = [] ;//liste programme associé au individu
        vm.reponse_individu = {} ;
        vm.all_individus = [] ;
        vm.all_menages = [] ;

        vm.nouvelle_element = false ;
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque = false ;
        vm.affichage_masque_individu = false ;
        vm.date_now = new Date() ;

        vm.disable_button = false ;
      //initialisation variable

      //test check radio button

      var toillete_checked = 0 ;
      var toillete_checked_id_lien_parente = 0 ;
      var toillete_checked_situation_matrimoniale = 0 ;
      var toillete_checked_id_handicap_visuel = 0 ;
      var toillete_checked_id_handicap_parole = 0 ;
      var toillete_checked_id_handicap_auditif = 0 ;
      var toillete_checked_id_handicap_mental = 0 ;
      var toillete_checked_id_handicap_moteur = 0 ;

      vm.test_check = function()
      {
        if (toillete_checked == vm.id_toilette) 
        {
          vm.id_toilette = null ;
        }
        else
        {
          toillete_checked = vm.id_toilette ;
        }
      }

      vm.etat_envoie = function(id_serveur_centrale)
      {
        if (id_serveur_centrale) 
        {
          return "Envoyé" ;
        }
        else
        {
          return "Non envoyé" ;
        }
      }

      vm.test_check_id_lien_parente = function()
      {
        if (toillete_checked_id_lien_parente == vm.reponse_individu.id_lien_parente) 
        {
          vm.reponse_individu.id_lien_parente = null ;
        }
        else
        {
          toillete_checked_id_lien_parente = vm.reponse_individu.id_lien_parente ;
        }
      }

      vm.test_check_situation_matrimoniale = function()
      {
        if (toillete_checked_situation_matrimoniale == vm.reponse_individu.situation_matrimoniale) 
        {
          vm.reponse_individu.situation_matrimoniale = null ;
        }
        else
        {
          toillete_checked_situation_matrimoniale = vm.reponse_individu.situation_matrimoniale ;
        }
      }

      vm.test_check_id_handicap_visuel = function()
      {
        if (toillete_checked_id_handicap_visuel == vm.reponse_individu.id_handicap_visuel) 
        {
          vm.reponse_individu.id_handicap_visuel = null ;
        }
        else
        {
          toillete_checked_id_handicap_visuel = vm.reponse_individu.id_handicap_visuel ;
        }
      }

      vm.test_check_id_handicap_parole = function()
      {
        if (toillete_checked_id_handicap_parole == vm.reponse_individu.id_handicap_parole) 
        {
          vm.reponse_individu.id_handicap_parole = null ;
        }
        else
        {
          toillete_checked_id_handicap_parole = vm.reponse_individu.id_handicap_parole ;
        }
      }

      vm.test_check_id_handicap_auditif = function()
      {
        if (toillete_checked_id_handicap_auditif == vm.reponse_individu.id_handicap_auditif) 
        {
          vm.reponse_individu.id_handicap_auditif = null ;
        }
        else
        {
          toillete_checked_id_handicap_auditif = vm.reponse_individu.id_handicap_auditif ;
        }
      }

      vm.test_check_id_handicap_mental = function()
      {
        if (toillete_checked_id_handicap_mental == vm.reponse_individu.id_handicap_mental) 
        {
          vm.reponse_individu.id_handicap_mental = null ;
        }
        else
        {
          toillete_checked_id_handicap_mental = vm.reponse_individu.id_handicap_mental ;
        }
      }

      vm.test_check_id_handicap_moteur = function()
      {
        if (toillete_checked_id_handicap_moteur == vm.reponse_individu.id_handicap_moteur) 
        {
          vm.reponse_individu.id_handicap_moteur = null ;
        }
        else
        {
          toillete_checked_id_handicap_moteur = vm.reponse_individu.id_handicap_moteur ;
        }
      }


      //fin test check radio button

      //chargement clé etrangère et données de bases
        apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });


        apiFactory.getAll("source_eau/index").then(function(result)
        { 
          vm.all_source_eau = result.data.response;    
          
        });
        apiFactory.getAll("toilette/index").then(function(result)
        { 
          vm.all_toilette = result.data.response;    
          
        });

        apiFactory.getAll("bien_equipement/index").then(function(result)
        { 
          vm.all_bien_equipement = result.data.response;    
          
        });

        apiFactory.getAll("revetement_sol/index").then(function(result)
        { 
          vm.all_revetement_sol = result.data.response;    
          
        });
        apiFactory.getAll("revetement_toit/index").then(function(result)
        { 
          vm.all_revetement_toit = result.data.response;    
          
        });
        apiFactory.getAll("revetement_mur/index").then(function(result)
        { 
          vm.all_revetement_mur = result.data.response;    
          
        });

        apiFactory.getAll("type_culture/index").then(function(result)
        { 
          vm.all_type_culture = result.data.response;    
          
        });

        apiFactory.getAll("type_elevage/index").then(function(result)
        { 
          vm.all_type_elevage = result.data.response;    
          
        });

        apiFactory.getAll("programme/index").then(function(result)
        { 
          vm.all_programme = result.data.response;    
          
        });
      //chargement clé etrangère et données de bases


      //QUESTIONNAIRE INDIVIDU
      apiFactory.getTable("enquete_menage/index","liendeparente").then(function(result){
        vm.allRecordsLiendeparente = result.data.response;
      }); 

      apiFactory.getTable("enquete_menage/index","situation_matrimoniale").then(function(result){
        vm.allRecordssituation_matrimoniale = result.data.response;
       
      }); 
      apiFactory.getTable("enquete_menage/index","handicap_visuel").then(function(result){
        vm.allRecordsHandicapvisuel = result.data.response;

      });  
      apiFactory.getTable("enquete_menage/index","handicap_parole").then(function(result){
        vm.allRecordsHandicapparole = result.data.response;

      }); 
      apiFactory.getTable("enquete_menage/index","handicap_auditif").then(function(result){
        vm.allRecordsHandicapauditif = result.data.response;

      });  
      apiFactory.getTable("enquete_menage/index","handicap_mental").then(function(result){
        vm.allRecordsHandicapmental = result.data.response;

      }); 
      apiFactory.getTable("enquete_menage/index","handicap_moteur").then(function(result){
        vm.allRecordsHandicapmoteur = result.data.response;

      });   

      apiFactory.getTable("enquete_menage/index","vaccin").then(function(result){
        vm.allVaccin = result.data.response;

      });  
      //FIN QUESTIONNAIRE INDIVIDU
      
      vm.get_max_id_generer_ref = function()
      {
        apiFactory.getAPIgeneraliserREST("menage/index","max_id",1).then(function(result)
        { 
          vm.max_id =  result.data.response.id;
          
          var tab_ile = vm.all_ile ;
          var tab_reg = [] ;
          var tab_com = [] ;
          var tab_vil = [] ;
          tab_reg = vm.all_region ;
          tab_com = vm.all_commune ;
          tab_vil = vm.all_village ;
          var ile ;
          var reg ;
          var com ;
          var vill ;
          if (vm.filtre.id_ile) 
          {
            ile = tab_ile.filter(function(obj)
            {
              return obj.id == vm.filtre.id_ile;
            });
          }
          if (vm.filtre.id_region && (tab_reg.length > 0 )) 
          {
            reg = tab_reg.filter(function(obj)
            {
              return obj.id == vm.filtre.id_region;
            });
          }

          if (vm.filtre.id_commune && tab_com.length > 0) 
          {
            com = tab_com.filter(function(obj)
            {
              return obj.id == vm.filtre.id_commune;
            });
          }

          if (vm.filtre.village_id && tab_vil.length > 0) 
          {
            vill = tab_vil.filter(function(obj)
            {
              return obj.id == vm.filtre.village_id;
            });
          }

         if (tab_vil) 
         {
          if (tab_vil.length > 0) 
          {
            if (vm.nouvelle_element) 
            {
              vm.filtre.NumeroEnregistrement = ile[0].Code + "/"+reg[0].Code+"/"+ com[0].Code+"/"+vill[0].Code+"/" + (Number(vm.max_id)+1) ;
            }
            else
            {
              vm.filtre.NumeroEnregistrement = ile[0].Code + "/"+reg[0].Code+"/"+ com[0].Code+"/"+vill[0].Code+"/" + vm.selectedItem.id ;
            }
            
          }
         }
          

          
        });
      }
      
      vm.afficher_masque_ajout = function()
      {
        vm.nouvelle_element = true ;
        vm.affichage_masque = true ;
        vm.selectedItem = {} ;
        
        vm.filtre.NumeroEnregistrement = '' ;
        vm.filtre.nomchefmenage = '' ;
        vm.filtre.PersonneInscription = '' ;
        vm.filtre.agechefdemenage = '' ;
        vm.filtre.SexeChefMenage = '' ;
        vm.filtre.Addresse = '' ;
        vm.filtre.DateInscription = new Date() ;

        vm.get_max_id_generer_ref();
      }

      vm.modifier = function()
      {
        vm.nouvelle_element = false ;
        vm.affichage_masque = true ;

        vm.filtre.DateInscription = new Date(vm.selectedItem.DateInscription);
        vm.filtre.village_id = vm.selectedItem.village_id ;
        //vm.filtre.NumeroEnregistrement = vm.selectedItem.NumeroEnregistrement ;
        vm.filtre.nomchefmenage = vm.selectedItem.nomchefmenage ;
        vm.filtre.PersonneInscription = vm.selectedItem.PersonneInscription ;
        vm.filtre.agechefdemenage = Number(vm.selectedItem.agechefdemenage) ;
        vm.filtre.SexeChefMenage = vm.selectedItem.SexeChefMenage ;
        vm.filtre.Addresse = vm.selectedItem.Addresse ;

        vm.get_max_id_generer_ref();

      }



      vm.annuler = function()
      {
        vm.nouvelle_element = false ;
        vm.affichage_masque = false ;
      }

      vm.annuler_individu = function()
      {
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque_individu = false ;
      }
      vm.ajout_individu = function()
      {
        vm.affichage_masque_individu = true ;
        vm.nouvelle_element_individu = true ;
        vm.individu_masque = {} ;
      }

      vm.modifier_individu = function()
      {
        vm.nouvelle_element_individu = false ;
        vm.affichage_masque_individu = true ;

        vm.individu_masque.Nom = vm.selectedItem_individu.Nom ;
        vm.individu_masque.Activite = vm.selectedItem_individu.Activite ;
        vm.individu_masque.travailleur = vm.selectedItem_individu.travailleur ;
        vm.individu_masque.sexe = vm.selectedItem_individu.sexe ;
        vm.individu_masque.DateNaissance = new Date(vm.selectedItem_individu.DateNaissance) ;
      }

      vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
          vm.get_max_id_generer_ref();
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.village_id = null ; 
          vm.get_max_id_generer_ref();  
          
        });
      }

      vm.generer_ref = function()
      {
        vm.get_max_id_generer_ref();
      }

      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;    
          vm.filtre.village_id = null ; 
          
          
        });
      }

      

      

      vm.filtrer = function()
      {
        vm.affiche_load = true ;
      	apiFactory.getAPIgeneraliserREST("menage/index","cle_etrangere",vm.filtre.village_id).then(function(result)
        { 
          vm.all_menages = result.data.response;    
          vm.affiche_load = false ;
        });
      }


      vm.get_individus_by_menage = function(menage_id)
      {
        vm.affiche_load = true ;
        apiFactory.getAPIgeneraliserREST("individu/index","cle_etrangere",menage_id).then(function(result)
        { 
          vm.all_individus = result.data.response;    
          vm.affiche_load = false ;
        });
      }


      vm.get_enquete_by_menage = function(menage_id)
      {

        vm.tab_reponse_source_eau = [] ;
        vm.tab_reponse_bien_equipement = [] ;
        vm.tab_reponse_revetement_sol = [] ;
        vm.tab_reponse_revetement_toit = [] ;
        vm.tab_reponse_revetement_mur = [] ;
        vm.tab_reponse_type_culture = [] ;
        vm.tab_reponse_type_elevage = [] ;
       // vm.tab_programme = [] ;
        
        apiFactory.getAPIgeneraliserREST("enquete_menage_traitement/index","cle_etrangere",menage_id).then(function(result)
        { 
          vm.enquete_by_menage = result.data.response;   
          console.log(vm.enquete_by_menage);

          if (vm.enquete_by_menage.source_eau) 
          {
            vm.tab_reponse_source_eau = vm.enquete_by_menage.source_eau ;
          }

          if (vm.enquete_by_menage.bien_equipement) 
          {
            vm.tab_reponse_bien_equipement = vm.enquete_by_menage.bien_equipement ;
          }

          if (vm.enquete_by_menage.revetement_sol) 
          {
            vm.tab_reponse_revetement_sol = vm.enquete_by_menage.revetement_sol ;
          }

          if (vm.enquete_by_menage.revetement_toit) 
          {
            vm.tab_reponse_revetement_toit = vm.enquete_by_menage.revetement_toit ;
          }

          if (vm.enquete_by_menage.revetement_mur) 
          {
            vm.tab_reponse_revetement_mur = vm.enquete_by_menage.revetement_mur ;
          }

          if (vm.enquete_by_menage.type_culture) 
          {
            vm.tab_reponse_type_culture = vm.enquete_by_menage.type_culture ;
          }

          if (vm.enquete_by_menage.type_elevage) 
          {
            vm.tab_reponse_type_elevage = vm.enquete_by_menage.type_elevage ;
          }

          vm.id_toilette = vm.enquete_by_menage.toilette ;

          if (vm.enquete_by_menage.id) 
          {
            vm.id_enquete_menage = vm.enquete_by_menage.id ;
          }
          else
          {
            vm.id_enquete_menage = 0 ; 
          }

         
        });
        
      }

      vm.get_menage_programme_by_menage = function(menage_id)
      {
        vm.tab_programme = [] ;
        apiFactory.getAPIgeneraliserREST("menage_programme/index","cle_etrangere",menage_id).then(function(result)
        {
          vm.menage_programme_liaisons = result.data.response; 

          /*if (vm.menage_programme_liaisons.length > 0) 
          {
            var tab = [] ;
            vm.menage_programme_liaisons.forEach( function(element, index) {
              tab.push(element.id_programme);
            });
            vm.tab_programme = tab ;

          }*/

          if (vm.menage_programme_liaisons.id_programme) 
          {
            vm.tab_programme = vm.menage_programme_liaisons.id_programme ;
          }

          if (vm.menage_programme_liaisons.id) 
          {
            vm.id_menage_programme = vm.menage_programme_liaisons.id ;
          }
          else
          {
            vm.id_menage_programme = 0 ; 
          }
         

        });
      }


      vm.get_enquete_individu_by_individu = function(id_individu)
      {
        vm.tab_reponse_vaccin = [] ;
        apiFactory.getAPIgeneraliserREST("enquete_individu_traitement/index","cle_etrangere",id_individu).then(function(result)
        {
          vm.enquete_individu = result.data.response ;

          vm.reponse_individu.id_lien_parente = vm.enquete_individu.id_lien_parente ;
          vm.reponse_individu.situation_matrimoniale = vm.enquete_individu.situation_matrimoniale ;
          vm.reponse_individu.id_handicap_auditif = vm.enquete_individu.id_handicap_auditif ;
          vm.reponse_individu.id_handicap_mental = vm.enquete_individu.id_handicap_mental ;
          vm.reponse_individu.id_handicap_moteur = vm.enquete_individu.id_handicap_moteur ;
          vm.reponse_individu.id_handicap_parole = vm.enquete_individu.id_handicap_parole ;
          vm.reponse_individu.id_handicap_visuel = vm.enquete_individu.id_handicap_visuel ;
          

          if (vm.enquete_individu.vaccins) 
          {
            vm.tab_reponse_vaccin = vm.enquete_individu.vaccins ;
          }
          vm.reponse_individu.enfant_femme = {};
          vm.reponse_individu.enfant_femme.poids = Number(vm.enquete_individu.poids) ;
          vm.reponse_individu.enfant_femme.perimetre_bracial = Number(vm.enquete_individu.perimetre_bracial) ;
          vm.reponse_individu.enfant_femme.age_mois = Number(vm.enquete_individu.age_mois) ;
          vm.reponse_individu.enfant_femme.taille = Number(vm.enquete_individu.taille) ;
          vm.reponse_individu.enfant_femme.zscore = Number(vm.enquete_individu.zscore) ;
          vm.reponse_individu.enfant_femme.mois_grossesse = Number(vm.enquete_individu.mois_grossesse) ;

          if (vm.enquete_individu.id) 
          {
            vm.id_enquete_individu = vm.enquete_individu.id ;
          }
          else
          {
            vm.id_enquete_individu = 0 ; 
          }

        });
      }

      vm.get_individu_programme_by_individu = function(id_individu)
      {
        vm.tab_programme_individu = [] ;
        apiFactory.getAPIgeneraliserREST("individu_programme/index","cle_etrangere",id_individu).then(function(result)
        {
          vm.individu_programme_liaisons = result.data.response; 


          if (vm.individu_programme_liaisons.id_programme) 
          {
            vm.tab_programme_individu = vm.individu_programme_liaisons.id_programme ;
          }

          if (vm.individu_programme_liaisons.id) 
          {
            vm.id_individu_programme = vm.individu_programme_liaisons.id ;
          }
          else
          {
            vm.id_individu_programme = 0 ; 
          }
         
        });
      }

      vm.selection= function (item)
      {

        if ((!vm.affiche_load)&&(!vm.affichage_masque)) 
        {
          //vidage tab reponse
          vm.all_individus = [] ;
          //vidage tab reponse
          vm.selectedItem_individu = {} ;//raz individu_selected
          vm.selectedItem = item;
          vm.nouvelItem   = item;

          console.log("id serveur menage == "+item.id_serveur_centrale);
          //get individu
          vm.get_individus_by_menage(item.id);
          vm.get_enquete_by_menage(item.id);
          vm.get_menage_programme_by_menage(item.id);
          //get individu
        }
        
      }

      $scope.$watch('vm.selectedItem', function()
      {
        if (!vm.all_menages) return;
        vm.all_menages.forEach(function(item) 
        {
          item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      })

      vm.selection_individu= function (item)
      {
        console.log(item);

        if (!vm.affichage_masque_individu) 
        {
          vm.reponse_individu.enfant_femme = {};
          vm.selectedItem_individu = item;
          vm.nouvelItem_individu   = item;
          vm.get_enquete_individu_by_individu(item.id) ;
          vm.get_individu_programme_by_individu(item.id);
        }

        
      }

      $scope.$watch('vm.selectedItem_individu', function()
      {
        if (!vm.all_individus) return;
        vm.all_individus.forEach(function(item) 
        {
          item.$selected = false;
        });
        vm.selectedItem_individu.$selected = true;
      })


      //CHECK BOK MULTISELECT
        vm.toggle = function (item, list) {
          var idx = list.indexOf(item);
          if (idx > -1) list.splice(idx, 1);
          else list.push(item);
        
        };
        $scope.exists = function (item, list) {
          if (list) 
          {
            return list.indexOf(item) > -1;
          }
          
        };
      //FIN CHECK BOK MULTISELECT

      vm.showAlert = function(titre,textcontent) 
        {
          
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(textcontent)
            .ariaLabel('Information')
            .ok('Fermer')
            .targetEvent()
          );
        } 

      function formatDateBDD(dat)
      {
        if (dat) 
        {
          var date = new Date(dat);
          var mois = date.getMonth()+1;
          var dates = (date.getFullYear()+"-"+mois+"-"+date.getDate());
          return dates;
        }
          

      }

      vm.formatDateListe = function (dat)
      {
        if (dat) 
        {
          var date = new Date(dat);
          var mois = date.getMonth()+1;
          var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
          return dates;
        }
          

      }

      vm.affichage_sexe_int = function(sexe_int)
      {
        
        switch (sexe_int) {
          case '1':
            return "Homme" ;
            break;
          case '0':
            return "Femme" ;
            break;
          default:
            return "Non identifier"
            break;
        }
      }

      vm.save_reponse_menage = function()
      {

        vm.disable_button = true ;

        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_enquete_menage ,
                      id_serveur_centrale: vm.enquete_by_menage.id_serveur_centrale ,
                      id_menage: vm.selectedItem.id,
                      source_eau: vm.tab_reponse_source_eau,
                      toilette: vm.id_toilette,
                      bien_equipement: vm.tab_reponse_bien_equipement,                              
                      revetement_sol: vm.tab_reponse_revetement_sol,                              
                      revetement_toit: vm.tab_reponse_revetement_toit,                              
                      revetement_mur: vm.tab_reponse_revetement_mur,                              
                      type_culture: vm.tab_reponse_type_culture,                              
                      type_elevage: vm.tab_reponse_type_elevage                            
                    });

        apiFactory.add("enquete_menage_traitement/index",datas, config).success(function (data) 
        {
          vm.disable_button = false ;
          vm.showAlert("Information",'Enregistrement réussi!');
           if (vm.id_enquete_menage == 0) 
          {
            vm.id_enquete_menage = data.response ;
          }
         
        
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        });  

        
      }

      vm.save_reponse_menage_programme = function()
      {
        vm.disable_button = true ;
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_menage_programme ,
                      id_serveur_centrale: vm.menage_programme_liaisons.id_serveur_centrale ,
                      id_menage: vm.selectedItem.id,
                      id_programme: vm.tab_programme
                                                 
                    });

        console.log("id central = "+vm.menage_programme_liaisons.id_serveur_centrale);

        apiFactory.add("menage_programme/index",datas, config).success(function (data) 
        {
          vm.disable_button = false ;
          vm.showAlert("Information",'Enregistrement réussi!');
          if (vm.id_menage_programme == 0) 
          {
            vm.id_menage_programme = data.response ;
          }
        
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        }); 
      }

      vm.save_reponse_individu = function(reponse_individu)
      {
        vm.disable_button = true ;
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_enquete_individu ,
                      id_individu: vm.selectedItem_individu.id,
                      id_lien_parente: reponse_individu.id_lien_parente,
                      situation_matrimoniale: reponse_individu.situation_matrimoniale,
                      id_handicap_visuel: reponse_individu.id_handicap_visuel,
                      id_handicap_parole: reponse_individu.id_handicap_parole,
                      id_handicap_auditif: reponse_individu.id_handicap_auditif,
                      id_handicap_mental: reponse_individu.id_handicap_mental,
                      id_handicap_moteur: reponse_individu.id_handicap_moteur,
                      vaccins: vm.tab_reponse_vaccin,
                      poids: reponse_individu.enfant_femme.poids,
                      perimetre_bracial: reponse_individu.enfant_femme.perimetre_bracial,
                      age_mois: reponse_individu.enfant_femme.age_mois,
                      taille: reponse_individu.enfant_femme.taille,
                      zscore: reponse_individu.enfant_femme.zscore,
                      mois_grossesse: reponse_individu.enfant_femme.mois_grossesse
                                                 
                    });


        apiFactory.add("enquete_individu_traitement/index",datas, config).success(function (data) 
        {
          vm.disable_button = false ;
          vm.showAlert("Information",'Enregistrement réussi!');
          if (vm.id_enquete_individu == 0) 
          {
            vm.id_enquete_individu = data.response ;
          }
          
         
        
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        });  

  
      }

      vm.save_reponse_individu_programme = function()
      {
        vm.disable_button = true ;
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_individu_programme ,
                      id_individu: vm.selectedItem_individu.id,
                      id_programme: vm.tab_programme_individu
                                                 
                    });

        apiFactory.add("individu_programme/index",datas, config).success(function (data) 
        {
          vm.disable_button = false ;
          vm.showAlert("Information",'Enregistrement réussi!');
          if (vm.id_individu_programme == 0) 
          {
            vm.id_individu_programme = data.response ;
          }
        
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        }); 
      }

      vm.save_menage = function(menage)
      {
        vm.disable_button = true ;
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };
        var id_mng = 0 ;
        if (!vm.nouvelle_element) 
        {
          var id_mng = vm.selectedItem.id ;
        }
        

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_mng ,
                      id_serveur_centrale: vm.selectedItem.id_serveur_centrale,
                      village_id: menage.village_id,
                      DateInscription: formatDateBDD(menage.DateInscription),
                      NumeroEnregistrement: menage.NumeroEnregistrement,
                      nomchefmenage: menage.nomchefmenage,
                      PersonneInscription: menage.PersonneInscription,
                      agechefdemenage: menage.agechefdemenage,
                      SexeChefMenage: menage.SexeChefMenage,
                      Addresse: menage.Addresse
                                                 
                    });
        apiFactory.add("menage/index",datas, config).success(function (data) 
        {
          vm.affichage_masque = false ;
          vm.disable_button = false ;
          vm.showAlert("Information",'Enregistrement réussi!');

          if (vm.nouvelle_element) 
          {
            var mng={

                          id : data.response ,
                          id_serveur_centrale : null ,
                          village_id: menage.village_id,
                          DateInscription: (menage.DateInscription),
                          NumeroEnregistrement: menage.NumeroEnregistrement,
                          nomchefmenage: menage.nomchefmenage,
                          PersonneInscription: menage.PersonneInscription,
                          agechefdemenage: menage.agechefdemenage,
                          SexeChefMenage: menage.SexeChefMenage,
                          Addresse: menage.Addresse

                       }

                       console.log(menage);

            vm.all_menages.push(mng) ;
          }
          else
          {
            vm.affichage_masque_individu = false ;
             vm.selectedItem.DateInscription =  vm.filtre.DateInscription ;
             vm.selectedItem.village_id = vm.filtre.village_id  ;
             vm.selectedItem.NumeroEnregistrement = vm.filtre.NumeroEnregistrement  ;
             vm.selectedItem.nomchefmenage = vm.filtre.nomchefmenage  ;
             vm.selectedItem.PersonneInscription = vm.filtre.PersonneInscription  ;
             vm.selectedItem.agechefdemenage = vm.filtre.agechefdemenage  ;
             vm.selectedItem.SexeChefMenage = vm.filtre.SexeChefMenage  ;
             vm.selectedItem.Addresse = vm.filtre.Addresse  ;
          }
          
        
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        }); 
      }

      vm.envoie_menage = function()
      {
        vm.disable_button = true ;
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        var id_mng = 0 ;

        if (vm.selectedItem.id_serveur_centrale != null) 
        {
          var id_mng = vm.selectedItem.id_serveur_centrale ;
        }
 
        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_mng ,
                      village_id: vm.selectedItem.village_id,
                      DateInscription: formatDateBDD(vm.selectedItem.DateInscription),
                      NumeroEnregistrement: vm.selectedItem.NumeroEnregistrement,
                      nomchefmenage: vm.selectedItem.nomchefmenage,
                      PersonneInscription: vm.selectedItem.PersonneInscription,
                      agechefdemenage: vm.selectedItem.agechefdemenage,
                      SexeChefMenage: vm.selectedItem.SexeChefMenage,
                      Addresse: vm.selectedItem.Addresse
                                                 
                    });


        apiFactory.add_serveur_central("menage/index",datas, config).success(function (data) 
        {
          vm.disable_button = false ;
          vm.affichage_masque = false ;
          vm.disable_button = false ;
          vm.showAlert("Information",'Envoie réussi!');

          if (vm.selectedItem.id_serveur_centrale == null) 
          {
            vm.selectedItem.id_serveur_centrale =  data.response ;
          }
            var datas_update_local = $.param(
                    {    
                      supprimer:0,
                      id: vm.selectedItem.id ,
                      id_serveur_centrale: data.response ,
                      village_id: vm.selectedItem.village_id,
                      DateInscription: formatDateBDD(vm.selectedItem.DateInscription),
                      NumeroEnregistrement: vm.selectedItem.NumeroEnregistrement,
                      nomchefmenage: vm.selectedItem.nomchefmenage,
                      PersonneInscription: vm.selectedItem.PersonneInscription,
                      agechefdemenage: vm.selectedItem.agechefdemenage,
                      SexeChefMenage: vm.selectedItem.SexeChefMenage,
                      Addresse: vm.selectedItem.Addresse
                                                 
                    });

            apiFactory.add("menage/index",datas_update_local, config).success(function (dat) 
            {
              
            })
            .error(function (data) 
            {
              vm.disable_button = false ;
              console.log('erreur '+dat);
              vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
            }); 
            
          
          
        
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        }); 

        
      }

      vm.envoie_enquete_menage = function()
      {
        vm.disable_button = true ;
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        //vm.enquete_by_menage

        var id_mng = 0 ;

        if (vm.enquete_by_menage.id_serveur_centrale != null) 
        {
          var id_mng = vm.enquete_by_menage.id_serveur_centrale ;
        }

    

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_mng ,
                      id_menage: vm.selectedItem.id_serveur_centrale,
                      source_eau: vm.tab_reponse_source_eau,
                      toilette: vm.id_toilette,
                      bien_equipement: vm.tab_reponse_bien_equipement,                              
                      revetement_sol: vm.tab_reponse_revetement_sol,                              
                      revetement_toit: vm.tab_reponse_revetement_toit,                              
                      revetement_mur: vm.tab_reponse_revetement_mur,                              
                      type_culture: vm.tab_reponse_type_culture,                              
                      type_elevage: vm.tab_reponse_type_elevage                            
                    });

        apiFactory.add_serveur_central("enquete_menage_traitement/index",datas, config).success(function (data) 
        {
          vm.showAlert("Information",'Envoie réussi!');
          vm.disable_button = false ;
          if (vm.enquete_by_menage.id_serveur_centrale == null) 
          {
            vm.enquete_by_menage.id_serveur_centrale =  data.response ;

          }

            var datas_update_local = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_enquete_menage ,
                      id_serveur_centrale: data.response ,//id serveur enquete menage
                      id_menage: vm.selectedItem.id,//id local menage
                      source_eau: vm.tab_reponse_source_eau,
                      toilette: vm.id_toilette,
                      bien_equipement: vm.tab_reponse_bien_equipement,                              
                      revetement_sol: vm.tab_reponse_revetement_sol,                              
                      revetement_toit: vm.tab_reponse_revetement_toit,                              
                      revetement_mur: vm.tab_reponse_revetement_mur,                              
                      type_culture: vm.tab_reponse_type_culture,                              
                      type_elevage: vm.tab_reponse_type_elevage                            
                    });


            apiFactory.add("enquete_menage_traitement/index",datas_update_local, config).success(function (dat) 
            {
              
            })
            .error(function (dat) 
            {
              vm.disable_button = false ;
              console.log('erreur '+dat);
              vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
            }); 
            
          
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        }); 
      }

      vm.envoie_menage_programme = function()
      {
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };
        //menage_programme_liaisons

        var id_mng = 0 ;

        if (vm.menage_programme_liaisons.id_serveur_centrale != null) 
        {
          var id_mng = vm.menage_programme_liaisons.id_serveur_centrale ;
        }

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_mng ,
                      id_menage: vm.selectedItem.id_serveur_centrale,
                      id_programme: vm.tab_programme
                                                 
                    });

        apiFactory.add_serveur_central("menage_programme/index",datas, config).success(function (data) 
        {
          vm.showAlert("Information",'Envoie réussi!');
          if (vm.menage_programme_liaisons.id_serveur_centrale == null) 
          {
            vm.menage_programme_liaisons.id_serveur_centrale =  data.response ;
          }

          var datas_update_local = $.param(
                    {    
                      supprimer:0,
                      id: vm.id_menage_programme ,
                      id_serveur_centrale: data.response ,
                      id_menage: vm.selectedItem.id,
                      id_programme: vm.tab_programme
                                                 
                    });

          apiFactory.add("menage_programme/index",datas_update_local, config).success(function (dat) 
            {
              
            })
            .error(function (dat) 
            {
              vm.disable_button = false ;
              console.log('erreur '+dat);
              vm.showAlert("Alerte","Erreur lors de la mis à jour!");
            }); 
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        });
      }

      vm.save_individu = function(individu)
      {
        vm.disable_button = true ;
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        var id_idv = 0 ;
        if (!vm.nouvelle_element_individu) 
        {
          var id_idv = vm.selectedItem_individu.id ;
        }

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_idv ,
                      id_serveur_centrale: vm.selectedItem_individu.id_serveur_centrale,
                      menage_id: vm.selectedItem.id,
                      DateNaissance: formatDateBDD(individu.DateNaissance),
                      Activite: individu.Activite,
                      travailleur: individu.travailleur,
                      sexe: individu.sexe,
                      Nom: individu.Nom
                    
                                                 
                    });

        apiFactory.add("individu/index",datas, config).success(function (data) 
        {
          vm.disable_button = false ;
          vm.affichage_masque_individu = false ;
          vm.showAlert("Information",'Enregistrement réussi!');

          if (vm.nouvelle_element_individu) 
          {
            var indiv = {
              id:data.response ,
              menage_id: vm.selectedItem.id,
              DateNaissance: (individu.DateNaissance),
              Activite: individu.Activite,
              travailleur: individu.travailleur,
              sexe: individu.sexe,
              Nom: individu.Nom
            }

            vm.all_individus.push(indiv);
          }
          else
          {
            vm.affichage_masque_individu = false ;
            vm.selectedItem_individu.Nom = vm.individu_masque.Nom  ;
            vm.selectedItem_individu.Activite = vm.individu_masque.Activite   ;
            vm.selectedItem_individu.travailleur = vm.individu_masque.travailleur  ;
            vm.selectedItem_individu.sexe = vm.individu_masque.sexe  ;
            vm.selectedItem_individu.DateNaissance = vm.individu_masque.DateNaissance   ;
          }
          
        
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        });
      }

      vm.envoie_individu = function()
      {
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        var id_idv = 0 ;

        if (vm.selectedItem_individu.id_serveur_centrale != null) 
        {
          var id_idv = vm.selectedItem_individu.id_serveur_centrale ;
        }

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_idv ,
                      id_serveur_centrale: vm.selectedItem_individu.id_serveur_centrale,
                      menage_id: vm.selectedItem.id_serveur_centrale,
                      DateNaissance: formatDateBDD(vm.selectedItem_individu.DateNaissance),
                      Activite: vm.selectedItem_individu.Activite,
                      travailleur: vm.selectedItem_individu.travailleur,
                      sexe: vm.selectedItem_individu.sexe,
                      Nom: vm.selectedItem_individu.Nom
                    
                                                 
                    });

        apiFactory.add_serveur_central("individu/index",datas, config).success(function (data) 
        {
          vm.showAlert("Information",'Envoie réussi!');
          if (vm.selectedItem_individu.id_serveur_centrale == null) 
          {
            vm.selectedItem_individu.id_serveur_centrale =  data.response ;
          }
            var datas_update_local = $.param(
                    {    
                      supprimer:0,
                      id: vm.selectedItem_individu.id ,
                      id_serveur_centrale: data.response,
                      menage_id: vm.selectedItem.id,
                      DateNaissance: formatDateBDD(vm.selectedItem_individu.DateNaissance),
                      Activite: vm.selectedItem_individu.Activite,
                      travailleur: vm.selectedItem_individu.travailleur,
                      sexe: vm.selectedItem_individu.sexe,
                      Nom: vm.selectedItem_individu.Nom
                    
                                                 
                    });

            apiFactory.add("individu/index",datas_update_local, config).success(function (dat) 
            {
              
            })
            .error(function (dat) 
            {
              vm.disable_button = false ;
              console.log('erreur '+dat);
              vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
            }); 
          
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        }); 

      }

      vm.envoie_enquete_individu = function()
      {
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };

        //vm.enquete_by_menage

        var id_mng = 0 ;

        if (vm.enquete_individu.id_serveur_centrale != null) 
        {
          var id_mng = vm.enquete_individu.id_serveur_centrale ;
        }

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_mng ,
                      id_serveur_centrale: vm.enquete_individu.id_serveur_centrale,
                      id_individu: vm.selectedItem_individu.id_serveur_centrale,
                      id_lien_parente: vm.reponse_individu.id_lien_parente,
                      situation_matrimoniale: vm.reponse_individu.situation_matrimoniale,
                      id_handicap_visuel: vm.reponse_individu.id_handicap_visuel,
                      id_handicap_parole: vm.reponse_individu.id_handicap_parole,
                      id_handicap_auditif: vm.reponse_individu.id_handicap_auditif,
                      id_handicap_mental: vm.reponse_individu.id_handicap_mental,
                      id_handicap_moteur: vm.reponse_individu.id_handicap_moteur,
                      vaccins: vm.tab_reponse_vaccin,
                      poids: vm.reponse_individu.enfant_femme.poids,
                      perimetre_bracial: vm.reponse_individu.enfant_femme.perimetre_bracial,
                      age_mois: vm.reponse_individu.enfant_femme.age_mois,
                      taille: vm.reponse_individu.enfant_femme.taille,
                      zscore: vm.reponse_individu.enfant_femme.zscore,
                      mois_grossesse: vm.reponse_individu.enfant_femme.mois_grossesse
                                                 
                    });

        apiFactory.add_serveur_central("enquete_individu_traitement/index",datas, config).success(function (data) 
        {
          vm.showAlert("Information",'Envoie réussi!');
       
          if (vm.enquete_individu.id_serveur_centrale == null) 
          {
            vm.enquete_individu.id_serveur_centrale =  data.response ;

          }

            var datas_update_local = $.param(
                    {    
                         
                      supprimer:0,
                      id: vm.id_enquete_individu ,
                      id_serveur_centrale: data.response,
                      id_individu: vm.selectedItem_individu.id,
                      id_lien_parente: vm.reponse_individu.id_lien_parente,
                      situation_matrimoniale: vm.reponse_individu.situation_matrimoniale,
                      id_handicap_visuel: vm.reponse_individu.id_handicap_visuel,
                      id_handicap_parole: vm.reponse_individu.id_handicap_parole,
                      id_handicap_auditif: vm.reponse_individu.id_handicap_auditif,
                      id_handicap_mental: vm.reponse_individu.id_handicap_mental,
                      id_handicap_moteur: vm.reponse_individu.id_handicap_moteur,
                      vaccins: vm.tab_reponse_vaccin,
                      poids: vm.reponse_individu.enfant_femme.poids,
                      perimetre_bracial: vm.reponse_individu.enfant_femme.perimetre_bracial,
                      age_mois: vm.reponse_individu.enfant_femme.age_mois,
                      taille: vm.reponse_individu.enfant_femme.taille,
                      zscore: vm.reponse_individu.enfant_femme.zscore,
                      mois_grossesse: vm.reponse_individu.enfant_femme.mois_grossesse
                                                 
                    });                            
                    


            apiFactory.add("enquete_individu_traitement/index",datas_update_local, config).success(function (dat) 
            {
              
            })
            .error(function (dat) 
            {
              vm.disable_button = false ;
              console.log('erreur '+dat);
              vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
            }); 
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        });
      }

      vm.envoie_individu_programme = function()
      {
        var config =  {
                        headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                      };
        //menage_programme_liaisons

        var id_mng = 0 ;

        if (vm.individu_programme_liaisons.id_serveur_centrale != null) 
        {
          var id_mng = vm.individu_programme_liaisons.id_serveur_centrale ;
        }

        var datas = $.param(
                    {    
                      supprimer:0,
                      id: id_mng ,
                      id_individu: vm.selectedItem_individu.id_serveur_centrale,
                      id_programme: vm.tab_programme_individu
                                                 
                    });

        apiFactory.add_serveur_central("individu_programme/index",datas, config).success(function (data) 
        {
          vm.showAlert("Information",'Envoie réussi!');
          if (vm.individu_programme_liaisons.id_serveur_centrale == null) 
          {
            vm.individu_programme_liaisons.id_serveur_centrale =  data.response ;
          }

          var datas_update_local = $.param(
                    
                    {    
                      supprimer:0,
                      id: vm.id_individu_programme ,
                      id_serveur_centrale: data.response ,
                      id_individu: vm.selectedItem_individu.id,
                      id_programme: vm.tab_programme_individu
                                                 
                    });

          apiFactory.add("individu_programme/index",datas_update_local, config).success(function (dat) 
            {
              
            })
            .error(function (dat) 
            {
              vm.disable_button = false ;
              console.log('erreur '+dat);
              vm.showAlert("Alerte","Erreur lors de la mis à jour!");
            });
        })
        .error(function (data) 
        {
          vm.disable_button = false ;
          console.log('erreur '+data);
          vm.showAlert("Alerte","Erreur lors de l'enregistrement!");
        });
      }



    }
  })();

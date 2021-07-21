(function () {
  'use strict';
  angular
    .module('app.pfss.suiviactivite.suivi_arse.formation_technique.formation_menage')
    .controller('formationmenagesController', formationmenagesController);

  /** @ngInject */
  function formationmenagesController(apiFactory, $state, $mdDialog, $scope, $cookieStore, apiUrlExcel, apiUrlExcelimport) {
    var vm = this;

    vm.identification = {};
    vm.all_commune = [];
    vm.all_village = [];
    vm.all_formation_tech_base_menage = [];
    vm.dtOptions_new =
    {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple_numbers',
      retrieve: 'true',
      order: []
    };
    var nouvelle_identification = false;
    apiFactory.getAll("ile").then(function (result) {
      vm.all_ile = result.data.response;
    });

    apiFactory.getAll("region").then(function (result) {
      vm.all_regions = result.data.response;

    });

    apiFactory.getAll("commune").then(function (result) {
      vm.all_communes = result.data.response;

    });

    apiFactory.getAll("village").then(function (result) {
      vm.all_villages = result.data.response;

    });

    $scope.$watch('vm.identification.id_ile', function () {
      if (!vm.identification.id_ile) return;
      else {

        vm.all_commune = [];
        vm.all_village = [];



        vm.all_region = vm.all_regions;
        vm.all_region = vm.all_region.filter(function (obj) {
          return obj.ile.id == vm.identification.id_ile;
        })
      }

    });

    $scope.$watch('vm.identification.id_region', function () {
      if (!vm.identification.id_region) return;
      else {
        vm.all_village = [];




        vm.all_commune = vm.all_communes;
        vm.all_commune = vm.all_commune.filter(function (obj) {
          return obj.prefecture.id == vm.identification.id_region;
        })
      }

    });

    $scope.$watch('vm.identification.id_commune', function () {
      if (!vm.identification.id_commune) return;
      else {

        vm.all_village = vm.all_villages;
        vm.all_village = vm.all_village.filter(function (obj) {
          return obj.commune.id == vm.identification.id_commune;
        })
      }

    })

    $scope.$watch('vm.identification.id_village', function () {

      var v = vm.all_village.filter(function (obj) {
        return obj.id == vm.identification.id_village;
      });

      if (v.length > 0 && v[0].zip != null) {
        vm.identification.zip = v[0].zip.libelle;
        vm.identification.vague = v[0].vague;
  

      }
      else {
        vm.identification.zip = "";
        vm.identification.vague = "";
      }


    });
    apiFactory.getAll("Theme_formation/index").then(function (result) {
      vm.affiche_load = false;
      vm.all_theme_formation = result.data.response;


    });
    vm.all_theme_formation_details = [];
    apiFactory.getAll("Theme_formation_detail/index").then(function (result) {
      vm.affiche_load = false;
      vm.all_theme_formation_details = result.data.response;


    });

    apiFactory.getAll("Agent_ex/index").then(function (result) {
      vm.all_agex = result.data.response;
    });


    vm.open_masque_filtre = function () {
      vm.affichage_masque_filtre = true;
      vm.affichage_masque = false;
    }

    vm.fermer_masque_filtre = function () {
      vm.affichage_masque_filtre = false;
    }

    vm.ajout_identification = function () {
      vm.affichage_masque = true;
      vm.affichage_masque_filtre = false;


      nouvelle_identification = true;

      vm.identification = {};

    }

    vm.modif_identification = function () {
      vm.affichage_masque = true;
      vm.affichage_masque_filtre = false;
      nouvelle_identification = false;

      vm.identification.date = new Date(vm.selected_identification.date);

      vm.identification.id_theme_formation_detail = vm.selected_identification.id_theme_formation_detail;
      vm.identification.id_theme_formation = vm.selected_identification.id_theme_formation;

      vm.identification.id_ile = vm.selected_identification.id_ile;
      vm.identification.id_region = vm.selected_identification.id_region;
      vm.identification.id_commune = vm.selected_identification.id_commune;
      vm.identification.id_village = vm.selected_identification.id_village;

      vm.identification.contenu = vm.selected_identification.contenu;
      vm.identification.objectifs = vm.selected_identification.objectifs;
      vm.identification.methodologies = vm.selected_identification.methodologies;
      vm.identification.materiel = vm.selected_identification.materiel;
      vm.identification.duree = vm.selected_identification.duree;
    }

    vm.annuler = function () {
      vm.affichage_masque = false;
      vm.affichage_masque_filtre = false;
      nouvelle_identification = false;

      vm.selected_identification = {};
    }

    $scope.$watch('vm.identification.id_theme_formation', function () {
      if (vm.identification.id_theme_formation) {
       

        var tf = vm.all_theme_formation.filter(function (obj) {
          return obj.id == vm.identification.id_theme_formation;
        });

        vm.tfm = tf[0].description;
      }
      vm.all_theme_formation_detail = vm.all_theme_formation_details.filter(function (obj) {
        return obj.id_theme_formation == vm.identification.id_theme_formation;
      });

    });

    vm.get_formation_menage = function () {

      //id_theme_formation_detail dia id_theme_formation fa tsy te hanova code bdb
      vm.affiche_load = true;
      apiFactory.getParamsDynamic("Formation_tech_base_menage/index?id_theme_formation=" + vm.identification.id_theme_formation + "&id_village=" + vm.identification.id_village).then(function (result) {
        vm.affiche_load = false;
        vm.all_formation_tech_base_menage = result.data.response;

        console.log(vm.all_formation_tech_base_menage);

      });
    }

    vm.selected_identification = {};

    vm.entete_formation_tech_base_menage =
    [
      { titre: "Sous-thème" },
      { titre: "Date formation" },
      { titre: "Contenu" },
      { titre: "Objectifs" },
      { titre: "Méthodologies" },
      { titre: "Matériels et outils utilisés" },
      { titre: "Durée" }
    ];

    function convert_to_date_sql(date) {
      if (date) {
        var d = new Date(date);
        var jour = d.getDate();
        var mois = d.getMonth() + 1;
        var annee = d.getFullYear();
        if (mois < 10) {
          mois = '0' + mois;
        }
        if (jour < 10) {
          jour = '0' + jour;
        }
        var date_final = annee + "-" + mois + "-" + jour;
        return date_final
      }
    }

    vm.selection = function (item) {
      vm.selected_identification = item;


    }

    $scope.$watch('vm.selected_identification', function () {
      if (!vm.all_formation_tech_base_menage) return;
      vm.all_formation_tech_base_menage.forEach(function (item) {
        item.$selected = false;
      });
      vm.selected_identification.$selected = true;
    })

    vm.supprimer_identification = function () {
      vm.affichage_masque_societe_crevette = false;

      var confirm = $mdDialog.confirm()
        .title('Etes-vous sûr de supprimer cet enregistrement ?')
        .textContent('')
        .ariaLabel('Lucky day')
        .clickOutsideToClose(true)
        .parent(angular.element(document.body))
        .ok('ok')
        .cancel('annuler');
      $mdDialog.show(confirm).then(function () {

        vm.save_in_bdd(vm.selected_identification, 1);
      }, function () {
        //alert('rien');
      });
    }

    vm.save_in_bdd = function (data_masque, etat_suppression) {
      vm.affiche_load = true;
      var config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      };

      var id = 0;

      if (!nouvelle_identification) {
        id = vm.selected_identification.id;
      }


      var datas = $.param(
        {

          id: id,
          supprimer: etat_suppression,

          id_village: data_masque.id_village,
          id_theme_formation_detail: data_masque.id_theme_formation_detail,
          date: convert_to_date_sql(data_masque.date),
          contenu: data_masque.contenu,
          objectifs: data_masque.objectifs,
          methodologies: data_masque.methodologies,
          materiel: data_masque.materiel,
          duree: data_masque.duree
        });

      apiFactory.add("Formation_tech_base_menage/index", datas, config).success(function (data) {
        var v = vm.all_village.filter(function (obj) {
          return obj.id == data_masque.id_village;
        });

        var c = vm.all_commune.filter(function (obj) {
          return obj.id == data_masque.id_commune;
        });

        var r = vm.all_region.filter(function (obj) {
          return obj.id == data_masque.id_region;
        });

        var i = vm.all_ile.filter(function (obj) {
          return obj.id == data_masque.id_ile;
        });

        var tf = vm.all_theme_formation.filter(function (obj) {
          return obj.id == data_masque.id_theme_formation;
        });

        var tfd = vm.all_theme_formation_detail.filter(function (obj) {
          return obj.id == data_masque.id_theme_formation_detail;
        });

        if (!nouvelle_identification) {
          if (etat_suppression == 0) {


            vm.selected_identification.id_theme_formation = data_masque.id_theme_formation;
            vm.selected_identification.description_theme_formation = tf[0].description;

            vm.selected_identification.id_theme_formation_detail = data_masque.id_theme_formation_detail;
            vm.selected_identification.description_theme_formation_detail = tfd[0].description;

            vm.selected_identification.date = convert_to_date_sql(data_masque.date);
            vm.selected_identification.contenu = data_masque.contenu;
            vm.selected_identification.objectifs = data_masque.objectifs;
            vm.selected_identification.methodologies = data_masque.methodologies;
            vm.selected_identification.materiel = data_masque.materiel;
            vm.selected_identification.duree = data_masque.duree;

            vm.selected_identification.id_village = data_masque.id_village;
            vm.selected_identification.Village = v[0].Village;

            vm.selected_identification.id_commune = data_masque.id_commune;
            vm.selected_identification.Commune = c[0].Commune;

            vm.selected_identification.id_region = data_masque.id_region;
            vm.selected_identification.Region = r[0].Region;

            vm.selected_identification.id_ile = data_masque.id_ile;
            vm.selected_identification.Ile = i[0].Ile;




          }
          else {
            vm.all_formation_tech_base_menage = vm.all_formation_tech_base_menage.filter(function (obj) {
              return obj.id !== vm.selected_identification.id;
            });
          }

        }
        else {
          var item = {
            id: String(data.response),

            id_theme_formation: data_masque.id_theme_formation,
            description_theme_formation : tf[0].description,

            id_theme_formation_detail : data_masque.id_theme_formation_detail,
            description_theme_formation_detail : tfd[0].description,

            id_village: data_masque.id_village,
            Village: v[0].Village,

            id_commune: data_masque.id_commune,
            Commune: c[0].Commune,

            id_region: data_masque.id_region,
            Region: r[0].Region,

            id_ile: data_masque.id_ile,
            Ile: i[0].Ile,

            date: convert_to_date_sql(data_masque.date),
            contenu: data_masque.contenu,
            objectifs: data_masque.objectifs,
            methodologies: data_masque.methodologies,
            materiel: data_masque.materiel,
            duree: data_masque.duree
          }



          vm.all_formation_tech_base_menage.unshift(item);
        }
        nouvelle_identification = false;
        vm.affichage_masque = false;
        vm.affiche_load = false;
      })
        .error(function (data) { alert("Une erreur s'est produit"); });
    }

    //formation_tech_base_menage_fiche_presence 
            
        vm.all_formation_tech_base_menage_fiche_presence = [] ;

        vm.entete_formation_tech_base_menage_fiche_presence =
        [
            {titre:"Nom et prénom"},
            {titre:"Adresse"}
        ];

        vm.affiche_load = false ;

        vm.get_all_formation_tech_base_menage_fiche_presence = function () 
        {
            vm.affiche_load = true ;
            apiFactory.getAPIgeneraliserREST("formation_tech_base_menage_fiche_presence/index","id_ftbm",vm.selected_identification.id).then(function(result){
                vm.all_formation_tech_base_menage_fiche_presence = result.data.response;
                
                vm.affiche_load = false ;

            });  
        }

        //formation_tech_base_menage_fiche_presence..
            
            vm.selected_formation_tech_base_menage_fiche_presence = {} ;
            var current_selected_formation_tech_base_menage_fiche_presence = {} ;
             vm.nouvelle_formation_tech_base_menage_fiche_presence = false ;

        
            vm.selection_formation_tech_base_menage_fiche_presence = function(item)
            {
                vm.selected_formation_tech_base_menage_fiche_presence = item ;

                if (!vm.selected_formation_tech_base_menage_fiche_presence.$edit) //si simple selection
                {
                    vm.nouvelle_formation_tech_base_menage_fiche_presence = false ;  

                }

            }

            $scope.$watch('vm.selected_formation_tech_base_menage_fiche_presence', function()
            {
                if (!vm.all_formation_tech_base_menage_fiche_presence) return;
                vm.all_formation_tech_base_menage_fiche_presence.forEach(function(item)
                {
                    item.$selected = false;
                });
                vm.selected_formation_tech_base_menage_fiche_presence.$selected = true;

            });

           

            vm.ajouter_formation_tech_base_menage_fiche_presence = function()
            {
                vm.nouvelle_formation_tech_base_menage_fiche_presence = true ;
                var item = 
                    {
                        
                        $edit: true,
                        $selected: true,
                        id:'0',
                        id_ftbm:vm.selected_identification.id,
                        nom_prenom:'',
                        adresse:''
                        
                    } ;

                vm.all_formation_tech_base_menage_fiche_presence.unshift(item);
                vm.all_formation_tech_base_menage_fiche_presence.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_formation_tech_base_menage_fiche_presence = af;
                    
                  }
                });
            }

            vm.modifier_formation_tech_base_menage_fiche_presence = function()
            {
                vm.nouvelle_formation_tech_base_menage_fiche_presence = false ;
                vm.selected_formation_tech_base_menage_fiche_presence.$edit = true;
            
                current_selected_formation_tech_base_menage_fiche_presence = angular.copy(vm.selected_formation_tech_base_menage_fiche_presence);
            }

            vm.supprimer_formation_tech_base_menage_fiche_presence = function()
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

                vm.enregistrer_formation_tech_base_menage_fiche_presence(1);
                }, function() {
                //alert('rien');
                });
            }

            vm.annuler_formation_tech_base_menage_fiche_presence = function()
            {
                if (vm.nouvelle_formation_tech_base_menage_fiche_presence) 
                {
                    
                    vm.all_formation_tech_base_menage_fiche_presence.shift();
                    vm.selected_formation_tech_base_menage_fiche_presence = {} ;
                    vm.nouvelle_formation_tech_base_menage_fiche_presence = false ;
                }
                else
                {
                    

                    if (!vm.selected_formation_tech_base_menage_fiche_presence.$edit) //annuler selection
                    {
                        vm.selected_formation_tech_base_menage_fiche_presence.$selected = false;
                        vm.selected_formation_tech_base_menage_fiche_presence = {};
                    }
                    else
                    {
                        vm.selected_formation_tech_base_menage_fiche_presence.$selected = false;
                        vm.selected_formation_tech_base_menage_fiche_presence.$edit = false;
                    
                        vm.selected_formation_tech_base_menage_fiche_presence.nom_prenom = current_selected_formation_tech_base_menage_fiche_presence.nom_prenom;  
                        vm.selected_formation_tech_base_menage_fiche_presence.adresse = current_selected_formation_tech_base_menage_fiche_presence.adresse;  
                        vm.selected_formation_tech_base_menage_fiche_presence = {};
                    }

                    

                }
            }

            vm.enregistrer_formation_tech_base_menage_fiche_presence = function(etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };


                var datas = $.param(
                {
                    
                    supprimer:etat_suppression,
                    id:vm.selected_formation_tech_base_menage_fiche_presence.id,
                    id_ftbm:vm.selected_identification.id,

                    nom_prenom : vm.selected_formation_tech_base_menage_fiche_presence.nom_prenom ,
                    adresse : vm.selected_formation_tech_base_menage_fiche_presence.adresse 
                    
                    
                    
                });

                apiFactory.add("formation_tech_base_menage_fiche_presence/index",datas, config).success(function (data)
                {
                    vm.affiche_load = false ;
                    if (!vm.nouvelle_formation_tech_base_menage_fiche_presence) 
                    {
                        if (etat_suppression == 0) 
                        {
                            vm.selected_formation_tech_base_menage_fiche_presence.$edit = false ;
                            vm.selected_formation_tech_base_menage_fiche_presence.$selected = false ;
                            vm.selected_formation_tech_base_menage_fiche_presence = {} ;
                        }
                        else
                        {
                            vm.all_formation_tech_base_menage_fiche_presence = vm.all_formation_tech_base_menage_fiche_presence.filter(function(obj)
                            {
                                return obj.id !== vm.selected_formation_tech_base_menage_fiche_presence.id;
                            });

                            vm.selected_formation_tech_base_menage_fiche_presence = {} ;
                        }

                    }
                    else
                    {
                        vm.selected_formation_tech_base_menage_fiche_presence.$edit = false ;
                        vm.selected_formation_tech_base_menage_fiche_presence.$selected = false ;
                        vm.selected_formation_tech_base_menage_fiche_presence.id = String(data.response) ;

                        vm.nouvelle_formation_tech_base_menage_fiche_presence = false ;
                        vm.selected_formation_tech_base_menage_fiche_presence = {};

                    }
                })
                .error(function (data) {alert("Une erreur s'est produit");});
            }

        

        //fin formation_tech_base_menage_fiche_presence..
    //FIN formation_tech_base_menage_fiche_presence


  }
})();

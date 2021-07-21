(function ()
{
    'use strict';
    var my_toast_agep=null;
    angular
        .module('app.toolbar')
        .controller('Liste_pgesController', Liste_pgesController)
        .controller('Liste_contrat_agepController', Liste_contrat_agepController)
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($scope,$rootScope, $mdSidenav, $translate, $mdDialog, loginService, cookieService, $location,apiFactory,$cookieStore,$document)
    {
        var vm = this;
        // Data
        vm.userdetails = {
          "nom": cookieService.get('nom'),
          "prenom": cookieService.get('prenom')
        };

        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        vm.languages = {
            en: {
                'title'      : 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code'       : 'en',
                'flag'       : 'us'
            },
            fr: {
                'title'      : 'Frensh',
                'translation': 'TOOLBAR.FRENSH',
                'code'       : 'fr',
                'flag'       : 'fr'
            },
            mga: {
                'title'      : 'Malagasy',
                'translation': 'TOOLBAR.MGA',
                'code'       : 'mga',
                'flag'       : 'mga'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status)
        {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout()
        {
          loginService.logout();
        }

        vm.profil = function()
        {
            $location.path("administration/profil");
        }

        /**
         * Change Language
         */
        function changeLanguage(lang)
        {
            vm.selectedLanguage = lang;
            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
        $scope.click_here=function()
        {
            console.log('mety');
        }
        var id_user = $cookieStore.get('id');

        if (id_user) 
        { 
            apiFactory.getAPIgeneraliserREST("contrat_agep/index",'menu','getallcontrat_alert').then(function(result) 
            {
                var resultat = result.data.response;
                if (parseInt(resultat.length)!=0)
                { 
                    toastr.error(
                                    "Cliquer ici pour plus de détails",
                                    'Notification de fin de contrat AGEP',
                                    {  
                                        closeButton: true,
                                        tapToDismiss: false,
                                        extendedTimeOut:0,
                                        timeOut: 0,
                                        fadeOut:0, 
                                        onclick: function()
                                        {
                                            affiche_liste_contrat(resultat); 
                                        }
                                    }
                                );              
                }   
                //console.log(resultat);
            });
            apiFactory.getAPIgeneraliserREST("pges/index",'menu','get_pges_montant_differant').then(function(result) 
            {
                var resultat = result.data.response;
                //console.log(resultat);
                if (parseInt(resultat.length)!=0)
                { 
                    var tost=toastr.error(
                                    "Cliquer ici pour plus de détails",
                                    'Notification PGES',
                                    {  
                                        allowHtml: true,
                                        closeButton: true,
                                        tapToDismiss: false,
                                        extendedTimeOut:0,
                                        timeOut: 0,
                                        fadeOut:0, 
                                        onclick: function()
                                        {
                                            affiche_liste_pges(resultat); 
                                        }
                                    }
                                );              
                }   

            });
        }
        function affiche_liste_contrat(param) 
        {
            $mdDialog.show({
                controller: Liste_contrat_agepController,
                templateUrl: 'app/main/pfss/contrat_agep/liste_contrat_agep_alert.html',
                //parent: angular.element('#toast_contrat'),
                locals:{contrat: param},
                clickOutsideToClose:true
                });
        }
        function affiche_liste_pges(param) 
        {
            $mdDialog.show({
                controller: Liste_pgesController,
                templateUrl: 'app/main/pfss/gerer_pges/liste_pges_alert.html',
                //parent: angular.element('#toast_contrat'),
                locals:{pges: param},
                clickOutsideToClose:true
                });
               // console.log(param);
        }
          
    }    

    function Liste_contrat_agepController($scope, $mdDialog,contrat) 
    {
       
        $scope.contrat_liste = contrat; 
        $scope.dtOptions =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false,
            order: [] 
        };
        
        $scope.hide = function()
        {
            $mdDialog.hide();
        };

        $scope.cancel = function()
        {
            $mdDialog.cancel();
        };

        $scope.contrat_agep_column = 
        [
            {titre:"Contrat N°"},
            {titre:"AGEP"},
            {titre:"Sous projet"},
            {titre:"Montant du contrat"},
            {titre:"Montant paiement à effectué prévu"},
            {titre:"Date prévu fin contrat"}
        ];

    }
    
    function Liste_pgesController($scope, $mdDialog,pges) 
    {
       
        $scope.pges_liste = pges; 
        $scope.dtOptions =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false,
            order: [] 
        };
        
        $scope.hide = function()
        {
            $mdDialog.hide();
        };

        $scope.cancel = function()
        {
            $mdDialog.cancel();
        };

        $scope.pges_column = 
        [   
            {titre:"Ile"},            
            {titre:"Préfecture"},
            {titre:"Commune"},
            {titre:"Village"},
            {titre:"Sous projet"},
            {titre:"Bureau d\'étude"},
            {titre:"Référence contrat"},
            {titre:"Infrastructure"},
            {titre:"Montant total"}
        ];

    }

})();

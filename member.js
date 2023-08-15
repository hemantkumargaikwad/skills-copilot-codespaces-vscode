function skillsMember() {
  return {
    restrict: 'E',
    templateUrl: 'app/members/skillsMember.html',
    controllerAs: 'skillsMember',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.subscribe('skills');

      this.helpers({
        skills() {
          return Skills.find({});
        }
      });
    }
  }
}r
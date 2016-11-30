Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    // NOTE addded this on own because using method call instead
    // of Posts.update
    // because only getting error message
    // FIXME I should also highlight the fields throwing the error
    // and show the help block
    /*var errors = validatePost(postProperties);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);*/

    // Posts.update(currentPostId, {$set: postProperties}, function(error) {
    //   if (error) {
    //     // display the error to the user
    //     alert(error.reason);
    //   } else {
    //     Router.go('postPage', {_id: currentPostId});
    //   }
    // });

    //prevent duplicate urls through edit
    Meteor.call('postInsert', postProperties, function(error, result) {
      if (error)
        throwError(error.reason);

      if (result.postExists)
        throwError('This link has already been posted');

      Router.go('postPage', {_id: currentPostId});
    })
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});

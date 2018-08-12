var gulp = require('gulp');
var bs = require('browser-sync').create();

gulp.task('bs', function(){
  bs.init({
    server: ["public", "views"]
  });
});

gulp.task('watch', ['bs'], function(){
  gulp.watch("public/*.html").on("change", bs.reload);
  gulp.watch("public/js/*.js").on("change", bs.reload); 
  gulp.watch("public/css/*.css").on("change", bs.reload);
});

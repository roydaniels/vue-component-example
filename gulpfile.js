var gulp  = require('gulp'),
  jshint  = require('gulp-jshint'),
  component = require('gulp-component'),
  livereload = require('gulp-livereload'),
  dest = 'build';

gulp.task('staticsvr', function(next) {
  var staticS = require('node-static'),
      server = new staticS.Server('./'),
      port = 8001;
  require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      server.serve(request, response);
    }).resume();
  }).listen(port, function() {
    console.log('\nServer listening on port: ' + port + '\n');
    next();
  });
});

gulp.task('default', ['lint'], function () {
  return gulp.src('component.json')
    .pipe(component({
      standalone: true
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('lint', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', ['staticsvr'], function () {
  var server = livereload();
  gulp.watch(['component.json', 'src/**/*'], ['default']);
  gulp.watch(dest + '/**').on('change', function(file) {
    server.changed(file.path);
  });
});
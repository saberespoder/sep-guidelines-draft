// ================================================================
// IMPORTS
// ================================================================
import gulp from 'gulp';
import changed from 'gulp-changed';
import livereload from 'gulp-livereload';
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';
import scss from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import minifyCSS from 'gulp-cssnano';
import plumber from 'gulp-plumber';
import sequence from 'run-sequence';
// import spritesmith from 'gulp.spritesmith';

// ================================================================
// CONSTS
// ================================================================
const ENV = {
  development: true,
  production: false,
};

const PATH = {
  src: {
    styles: [
      'scss/main.scss',
    ],
  },

  build: {
    styles: 'build/css/',
  },

  watch: {
    styles: 'scss/**/*.scss',
  },
};

// ================================================================
// BUILD
// ================================================================
gulp.task('build', callback => {
  ENV.development = false;
  ENV.production = true;

  sequence(
    'styles',
    callback
  );
});

// ================================================================
// STYLES : Build all stylesheets
// ================================================================
gulp.task('styles', () => {
  gulp.src(PATH.src.styles)
    .pipe(changed(PATH.build.styles, { extension: '.css' }))
    .pipe(gulpIf(ENV.development, sourcemaps.init()))
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(scss())
    .pipe(gulpIf(ENV.production, autoprefixer({
      browsers: ['last 3 versions'],
    })))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulpIf(ENV.production, minifyCSS()))
    .pipe(gulpIf(ENV.development, sourcemaps.write('.')))
    .pipe(gulp.dest(PATH.build.styles))
    .pipe(livereload());
});

// ================================================================
// WATCH
// ================================================================
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch(PATH.watch.styles, ['styles']);
});

// ================================================================
// DEFAULT
// ================================================================
gulp.task('default', ['watch']);

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			options: {
				style: 'compressed'
			},
			dist: {
				files: {
					'dist/sf-leap/sf-leap.css': 'sf-themes/sites/sf-leap/sf-leap-theme.scss',
					'dist/sf-zaliet/sf-zaliet.css': 'sf-themes/sites/sf-zaliet/sf-zaliet-theme.scss',
					'dist/sf-lawconnect/sf-lawconnect.css': 'sf-themes/sites/sf-lawconnect/sf-lawconnect-theme.scss',
					'dist/sf-titlex/sf-titlex.css': 'sf-themes/sites/sf-titlex/sf-titlex-theme.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['sass']);
}
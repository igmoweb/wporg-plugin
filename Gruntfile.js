module.exports = function( grunt ) {
	require( 'load-grunt-tasks' )( grunt );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON('package.json'),

		// Generate POT files.
		makepot: {
			options: {
				type: 'wp-plugin',
				domainPath: 'languages',
        exclude: [ 'node_modules/*', 'vendor/*', 'tests/*', 'build/*', 'svn/*' ]
			},
			dist: {
				options: {
					potFilename: '<%= pkg.wporg.textdomain %>.pot',
				},
			},
		},

		"regex-replace": {
			placeholders: { //specify a target with any name
				src: [
					'./build/readme.txt',
					'./build/plugin.php',
				],
				actions: [
					{
						name: 'version',
						search: '%%version%%',
						replace: '<%= pkg.version %>',
						flags: 'g'
					},{
						name: 'testedupto',
						search: '%%testedupto%%',
						replace: '<%= pkg.wporg.testedupto %>',
						flags: 'g'
					},{
						name: 'requires',
						search: '%%requires%%',
						replace: '<%= pkg.wporg.requires %>',
						flags: 'g'
					}
				]
			}
		},

		shell: {
			command: 'svn co https://plugins.svn.wordpress.org/<%= pkg.wporg.slug %> svn'
		},

		copy: {
			main: {
				files: [
					{
						expand: true,
						src: [
							'**/**.*',
							'!.gitignore',
							'!node_modules/**/*',
							'!vendor/**/*',
							'!bin/**/*',
							'!composer.*',
							'!package.*',
							'!package-lock*',
							'!phpcs.xml',
							'!Gruntfile.js',
							'!build/**/*',
							'!svn/**/*',
							'!assets-wporg/**/*',
						],
						dest: 'build/',
					},
				],
			},
			svn: {
				files: [
					{
						expand: true,
						src: [
							'**/*.*'
						],
						dest: 'svn/trunk/',
						cwd: 'build/'
					},
					{
						expand: true,
						src: [
							'**/*.*'
						],
						dest: 'svn/tags/<%= pkg.version %>',
						cwd: 'build/'
					},
					{
						expand: true,
						src: [
							'**/*.*'
						],
						dest: 'svn/assets/',
						cwd: 'assets-wporg/'
					}
				]
			}
		},
		clean: {
			build: [
				'build'
			],
			svn: [
				'svn/tags/<%= pkg.version %>',
				'svn/trunk/',
				'svn/assets/'
			],
		}
	} );

	grunt.registerTask( 'default', [
		'makepot',
		'clean:build',
		'copy',
		'regex-replace:placeholders',
		'shell',
		'clean:svn',
		'copy:svn'
	] );

	grunt.registerTask( 'dopot', 'makepot' );
}

module.exports = function(grunt) {
	grunt.option("src", ["src/*.js", "src/*/*.js", "src/*/*/*.js"]);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			options: {
				multistr: true,
				eqnull: true,
			},
			source: grunt.option("src"),
		},
		concat: {
			options: {
				stripBanners: true,
				banner: "/*! Copyright (C) Calculingua - All Rights Reserved \n  Unauthorized copying of this file, via any medium is strictly prohibited \n  Proprietary and confidential \n \n  Author : [William Burke](mailto:wburke@calculingua.com)  \n  Date : <%= grunt.template.today('yyyy-mm-dd') %> */ \n\n",
			},
			webapp: {
				files: {
					"dist/cali-sdk.js": grunt.option("src"),
				}
			},
		},
		uglify: {
			my_target: {
				files: {
					'dist/cali-sdk.min.js': ["dist/cali-sdk.js"],
				}
			}
		},
		watch: {
			grunt: {
				files: ["Gruntfile.js"],
				tasks: ["build", "test"]
			},
			jshint: {
				files: grunt.option("src"),
				tasks: ["jshint"]
			
			},
			concat: {
				files: grunt.option("src"),
				tasks: ["concat"]
			},
			uglify: {
				files: ["dist/cali-sdk.js"],
				tasks: ["uglify"]
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("build", ["jshint", "concat", "uglify"]);
	grunt.registerTask("default", ["build", "watch"]);
}

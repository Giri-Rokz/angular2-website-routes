var config = {
   entry: ['./main.js','whatwg-fetch'],
	
   output: {
      path:'./',
      filename: 'index.js',
   },
	
   devServer: {
      inline: true,
      port: 2000
   },
	
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
				
            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   }
}

module.exports = config;
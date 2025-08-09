const fs = require('fs');
const path = require('path');

// Path to the text file containing all project files
const inputFile = 'car-financing-hub-files.txt';
// Root folder for the new project
const outputDir = 'carFinancingHubClean2025';

function recreateFiles() {
  try {
    // Read the input file
    const data = fs.readFileSync(inputFile, 'utf8');
    
    // Split the file into sections based on the delimiter
    const sections = data.split('=== FILE:');
    
    // Process each section (skip the first empty section)
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      // Extract the file path (between "=== FILE:" and "===")
      const pathEndIndex = section.indexOf('===');
      if (pathEndIndex === -1) continue;
      
      const filePath = section.substring(0, pathEndIndex).trim();
      const fileContent = section.substring(pathEndIndex + 3).trim();
      
      // Create the full path for the file
      const fullPath = path.join(outputDir, filePath);
      
      // Create the directory if it doesn't exist
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write the file content
      fs.writeFileSync(fullPath, fileContent);
      console.log(`Created file: ${fullPath}`);
    }
    
    console.log('All files have been recreated successfully in', outputDir);
  } catch (err) {
    console.error('Error recreating files:', err);
  }
}

// Run the script
recreateFiles();
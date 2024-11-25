import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import * as fs from 'fs/promises';
import * as path from 'path';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  const { messages } = data;
  const lastMessage = messages[messages.length - 1];

  try {
    // Simple command parsing
    const message = lastMessage.content.toLowerCase();
    
    if (message.startsWith('create file:')) {
      const fileName = message.replace('create file:', '').trim();
      const filePath = path.join(process.cwd(), fileName);
      
      await fs.writeFile(filePath, '');
      return json({
        role: 'assistant',
        content: `I've created a new file: ${fileName}`
      });
    }
    
    if (message.startsWith('write to file:')) {
      const [fileInfo, ...contentLines] = message.replace('write to file:', '').trim().split('\n');
      const filePath = path.join(process.cwd(), fileInfo.trim());
      const content = contentLines.join('\n');
      
      await fs.writeFile(filePath, content);
      return json({
        role: 'assistant',
        content: `I've written the content to: ${fileInfo.trim()}`
      });
    }

    // Default response if no file operation is requested
    return json({
      role: 'assistant',
      content: "I can help you with file operations. Try commands like:\n" +
               "- create file: filename.txt\n" +
               "- write to file: filename.txt\n  Your content here"
    });

  } catch (error) {
    console.error('Error:', error);
    return json({
      role: 'assistant',
      content: `Sorry, there was an error: ${error.message}`
    }, { status: 500 });
  }
};

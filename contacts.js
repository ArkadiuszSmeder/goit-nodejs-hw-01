import { promises as fs } from "fs";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, '/db/contacts.json');

const getContacts = async () => {
    try {
      const contactsData = await fs.readFile(contactsPath);
      return JSON.parse(contactsData);
    } catch (err) {
      console.log('Error reading contacts file:', err.message);
      throw err;
    }
  };

export const listContacts = async () => {
    try {
        return await getContacts();
    } catch (err) {
        console.log('Error listing contacts', err.message);
        throw err;
    }
  }
  
export const getContactById = async (contactId) => {
    try {
        const contacts = await getContacts();
        const contact = contacts.find(contact => contact.id === contactId);
        if (!contact) {
            console.log(`Contact with ID ${contactId} not found`);
        }
        return contact;
    } catch (err) {
        console.log(`Error getting contact by ID ${contactId}`, err.message)
        throw err;
    }
}
  
export const removeContact = async (contactId) => {
    try {
        let contacts = await getContacts();
        contacts = contacts.filter(contact => contact.id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    } catch (err) {
        console.log('Error removing contact', err.message)
        throw err;
    }
}
  
export const addContact = async (name, email, phone) => {
    try {
        const contacts = await getContacts();
        const newContact = {
            id: uuidv4(),
            name,
            email,
            phone,
        };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    } catch (err) {
        console.log('Error adding contact', err.message);
        throw err;
    }
}

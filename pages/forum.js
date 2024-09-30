"use client";
// spell-checker: disable
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Box,
    FormLabel,
    Input,
    Stack,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Select,
    Textarea,
    Button,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'; // Corrected import
import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
// spell-checker: enable

export default function DrawerExample() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = React.useRef();
    
    // State for uploaded file and selected category
    const [pdfFile, setPdfFile] = useState(null);
    const [category, setCategory] = useState('');

    const handleFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('PDF File:', pdfFile);
        console.log('Selected Category:', category);
        // Reset fields if needed
        setPdfFile(null);
        setCategory('');
        onClose(); // Close the drawer after submission
    };

    return (
        <>
            <Button leftIcon={<AddIcon />} colorScheme='teal' onClick={onOpen}>
                Upload PDF
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>
                        Upload a PDF
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing='24px'>
                            <Box>
                                <FormLabel htmlFor='pdf-upload'>Upload PDF</FormLabel>
                                <Input
                                    ref={firstField}
                                    id='pdf-upload'
                                    type='file'
                                    accept='application/pdf'
                                    onChange={handleFileChange}
                                />
                            </Box>

                            <Box>
                                <FormLabel htmlFor='category'>Select Category</FormLabel>
                                <Select
                                    id='category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value=''>--Select a Category--</option>
                                    <option value='documents'>Documents</option>
                                    <option value='reports'>Reports</option>
                                    <option value='invoices'>Invoices</option>
                                </Select>
                            </Box>

                            <Box>
                                <FormLabel htmlFor='desc'>Description (optional)</FormLabel>
                                <Textarea id='desc' />
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth='1px'>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

import React from 'react';
import { Table, Button } from 'react-bootstrap';

const FileTable = ({ files, onViewFile }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Document Name</th>
                </tr>
            </thead>
            <tbody>
                {files.map((file, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            <Button variant="link" onClick={() => onViewFile(file)}>
                                {file}
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default FileTable;

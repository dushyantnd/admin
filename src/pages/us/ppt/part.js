import React from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import { useRouter } from "next/router";
const List = ({ ppts, onDelete, currentPage, totalPages, onPageChange, handleDownloadPPT }) => {
  const router = useRouter();
  

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Header</th>
            <th>Footer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ppts && ppts.map((ppt, index) => (
            <tr key={ppt._id}>
              <td>{(currentPage - 1) * 5 + index + 1}</td>
              <td>{ppt.type}</td>
              <td>{ppt.header.title}</td>
              <td>{ppt.footer.text}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => alert(`Viewing PPT: ${ppt.header.title}`)}
                >
                  View
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDownloadPPT(ppt)}
                >
                  Download PPT
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() =>{ if(ppt.type == 'type_one'){
                    router.push(`/us/ppt/editSlide?id=${ppt._id}`)
                  }else{
                    router.push(`/us/ppt/edit?id=${ppt._id}`)
                  }  }}
                >
                  Edit
                </Button> &nbsp;
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(ppt._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Pagination.Item
            key={pageNumber + 1}
            active={currentPage === pageNumber + 1}
            onClick={() => onPageChange(pageNumber + 1)}
          >
            {pageNumber + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default List;

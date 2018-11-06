import styled from "styled-components";

const baseColor = "#666";

export default styled.div`
    margin: 0 auto;
    width: 450px;
    height: 50px;
    color: #fff;
    border-bottom: 1px solid ${baseColor};
    border-left: 1px solid ${baseColor};
    display: grid;
    grid-template: repeat(1, 1fr) / repeat(9, 1fr)
`
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import FindJobs from "../FindJobs";
import { jobPostingApi } from "../../../utils/api";

jest.mock("../../../utils/api", () => ({
  jobPostingApi: { getAll: jest.fn(), delete: jest.fn(), updateStatus: jest.fn() },
}));
jest.mock("../JobPostingCard", () => ({ jobPosting, deletePopupSwitch, setEditJobsInfo }) => (
  <div data-testid={`card-${jobPosting._id}`}>
    <span>{jobPosting.title}</span>
    <button onClick={() => { setEditJobsInfo(jobPosting); deletePopupSwitch(); }}>Delete</button>
  </div>
));
jest.mock("../EditJobs", () => () => <div />);
jest.mock("../DeletePopup", () => ({ deleteFunction }) => <button onClick={deleteFunction}>Confirm Delete</button>);
jest.mock("../../company-portal/CloseStatus", () => () => <div />);
const mockJobs = [
  { _id: "j1", title: "Frontend Dev", author: "TechCorp", location: "Remote", status: "ACTIVE" },
  { _id: "j2", title: "Backend Eng", author: "StartupXYZ", location: "Vancouver", status: "CLOSED" },
];

beforeEach(() => {
  jest.clearAllMocks();
  jobPostingApi.getAll.mockResolvedValue(mockJobs);
  jobPostingApi.delete.mockResolvedValue({});
});

it("render all job card after fetch", async () => {
  render(<FindJobs filter="" filterType="title" loading={false} setLoading={jest.fn()} />);
  await waitFor(() => expect(screen.getByTestId("card-j1")).toBeInTheDocument());
  expect(screen.getByTestId("card-j2")).toBeInTheDocument();
});

it("filter card by the filter", async () => {
  render(<FindJobs filter="Frontend" filterType="title" loading={false} setLoading={jest.fn()} />);
  await waitFor(() => expect(screen.getByTestId("card-j1")).toBeInTheDocument());
  expect(screen.queryByTestId("card-j2")).not.toBeInTheDocument();
});

it("delete job and remove it from the list", async () => {
  render(<FindJobs filter="" filterType="title" loading={false} setLoading={jest.fn()} />);
  await waitFor(() => expect(screen.getByTestId("card-j1")).toBeInTheDocument());
  act(() => screen.getAllByText("Delete")[0].click());
  act(() => screen.getByText("Confirm Delete").click());
  await waitFor(() => expect(screen.queryByTestId("card-j1")).not.toBeInTheDocument());
});
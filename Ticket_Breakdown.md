# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

---

### Assumptions
- The facility has a dashboard and a way to search for agents and view some data about them
- The facility has a way to edit some data about the agent
- Facilities may want to update only some of their agents with custom ids
- It is acceptable that facilities will have to update agents one-by-one
- Custom IDs are meant to reference other party's systems, and should therefore be unique
- Rolling out new tables in production is automated
- A developer is going through 1-2 SPs per day

### Tickets

**Facility Dashboard Edit Agent Page -- add an input for the custom ID field of an agent**

Implementation:
The facility client dashboard will need:
1. An input added to the top of the edit agent page labelled "custom id".
2. A tooltip on the input that reads "add a custom id to this agent which will be displayed on Reports.
3. Add the customId field to the payload of the edit agent API call.
4. Display the customId if one has already been set.
5. Update the E2E tests for updating agents to include the new field.

AC:
1. The facility user can view any custom ids of an agents.
2. The facility user can set a custom id, submit the edit agent page, and see that the custom id has been updated.

Effort:
1 SP

**Facility Backend -- new table for facility custom id -> agent mapping**

Description:
Because each facility will set their own custom ids on each agent, let's make a bridge table.

Implementation:

1. Add the table FacilityAgentMeta.
2. Use the schema { agentId: Agent, facilityId: Facility, customId?: string }.
3. Add a CRUD service layer for the table.
4. The facilityId->customId combined key should be unique.
5. Table is indexed by FacilityId + AgentId (Assume there is no lookup via customId)

AC:
1. Unit tests show CRUD operations on the table.
2. Unit tests show that trying to add two agents with the same custom ids from the same facility blows up.

Effort:
2 SP

**Facility Backend -- API route for Update Agent accepts customId field**

Implementation:

1. When a facility updates an agent and supplies a customId, make an upsert to the FacilityAgentMeta table.
2. Clean up all the records specific to a facility when it is deleted.

AC:
1. Unit tests show that agent update with customId makes a new record.
2. Unit tests show that two agent updates with customIds updates the single record.

Effort:
1 SP

**Report -- fetch and display custom ids**

Implementation:
1. Update getShiftsByFacility to populate FacilityAgentMeta records for each agent that appears.
2. Display the customId in place of our internal id on the report.
3. UI to differentiate between ids that are set customly by the facility and set by us.

AC:
1. Unit tests show that given agents with customIds exist, they have a populated field with the entire FacilityAgentMeta record on them.
2. Reports display custom ids for those that exist.
3. Facility users can tell which agents on the report have custom ids set.
4. Different facilities get different custom ids displayed when the report is generated.

Effort:
3 SP
import dbConnect from '../../utils/dbConnect';
import PPT from '../../models/PPT';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { id } = req.query; // Retrieve the `id` parameter from the query for DELETE and PUT
  console.log("id",id)
  switch (method) {
    case 'GET':
      if (id){
         try {
            const pptss = await PPT.findById(id);
        
            if (!pptss) {
              return res.status(404).json({ message: "PPts not found" });
            }
        
            res.status(200).json(pptss);
          } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch PPTs' });
          }
      }else{
        try {
          const ppts = await PPT.find();
          res.status(200).json({ success: true, data: ppts });
        } catch (error) {
          res.status(500).json({ success: false, error: 'Failed to fetch PPTs' });
        }
      }
      break;

    case 'POST':
      try {
        const ppt = await PPT.create(req.body);
        res.status(201).json({ success: true, data: ppt });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to create PPT' });
      }
      break;

    case 'PUT': // Update an existing PPT
      if (!id) {
        return res.status(400).json({ success: false, error: 'PPT ID is required for update' });
      }
      try {
        const updatedPPT = await PPT.findByIdAndUpdate(id, req.body, {
          new: true, // Return the updated document
          runValidators: true, // Enforce schema validation
        });
        if (!updatedPPT) {
          return res.status(404).json({ success: false, error: 'PPT not found' });
        }
        res.status(200).json({ success: true, data: updatedPPT });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to update PPT' });
      }
      break;

    case 'DELETE': // Delete an existing PPT
      if (!id) {
        return res.status(400).json({ success: false, error: 'PPT ID is required for delete' });
      }
      try {
        const deletedPPT = await PPT.findByIdAndDelete(id);
        if (!deletedPPT) {
          return res.status(404).json({ success: false, error: 'PPT not found' });
        }
        res.status(200).json({ success: true, data: deletedPPT });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to delete PPT' });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}

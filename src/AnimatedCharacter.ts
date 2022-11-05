/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';

export class AnimatedCharacter extends gfx.Transform3
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        
        // Create skeleton and add it as a child
        this.skeleton = new Skeleton();
        this.add(this.skeleton);

        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
    }

    createMeshes(): void
    {
        // Drawing the coordinate axes is a good way to check your work.
        // To start, this will just create the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you 
        // can draw the axes for each bone.  The visibility of the axes
        // is toggled using a checkbox.
        const axes = new gfx.Axes3(0.15);
        this.skeleton.add(axes);

        // Call the recursive method for each root bone
        this.skeleton.rootBones.forEach((rootBone: Bone) => {
            this.createMeshesRecursive(rootBone)
        });
    }

    private createMeshesRecursive(bone: Bone): void
    {
        // TO DO (PART 1): Draw the coordinate axes for the bone

        const axes = new gfx.Axes3(0.15);
        axes.lookAt(bone.direction);
        bone.transform.add(axes);


        // TO DO (PART 3): You will want to draw something different for each
        // part of the body. An if statement like this is an easy way
        // to do that.  You can find the names of additional bones in 
        // the .asf files.  Anything that you create will be automatically
        // be made invisible when the coordinate axes are visibile.
        const antColor = new gfx.Color(0.47, 0.23, 0.13);
        
        if (bone.name == 'head') {
            // Head/Face
            const headBone = new gfx.SphereMesh();
            headBone.scale.multiply(new gfx.Vector3(0.1, 0.2, 0.1));
            headBone.material.setColor(antColor);
            headBone.rotateX(gfx.MathUtils.degreesToRadians(-30));
            bone.transform.add(headBone);
            
            // Left Antenna
            const leftAntenna = new gfx.BoxMesh(0.01, 0.1, 0.01);
            leftAntenna.translate(new gfx.Vector3(-0.05, 0.18, 0));
            leftAntenna.rotateZ(gfx.MathUtils.degreesToRadians(30));
            leftAntenna.material.setColor(new gfx.Color(0, 0, 0));
            headBone.children.push(leftAntenna);
            bone.transform.add(leftAntenna);

            // Left Antenna Tip
            const leftAntennaTip = new gfx.ConeMesh(0.01, 0.1, 10);
            leftAntennaTip.translate(new gfx.Vector3(-0.07, 0.22, 0.05));
            leftAntennaTip.rotateZ(gfx.MathUtils.degreesToRadians(30));
            leftAntennaTip.rotateX(gfx.MathUtils.degreesToRadians(90));
            leftAntennaTip.material.setColor(new gfx.Color(0, 0, 0));
            leftAntenna.children.push(leftAntennaTip);
            bone.transform.add(leftAntennaTip);

            
            // Right Antenna
            const rightAntenna = new gfx.BoxMesh(0.01, 0.1, 0.01);
            rightAntenna.translate(new gfx.Vector3(0.05, 0.18, 0));
            rightAntenna.rotateZ(gfx.MathUtils.degreesToRadians(-30));
            rightAntenna.material.setColor(new gfx.Color(0, 0, 0));
            headBone.children.push(rightAntenna);
            bone.transform.add(rightAntenna);

            // Right Antenna Tip
            const rightAntennaTip = new gfx.ConeMesh(0.01, 0.1, 10);
            rightAntennaTip.translate(new gfx.Vector3(0.07, 0.22, 0.05));
            rightAntennaTip.rotateZ(gfx.MathUtils.degreesToRadians(-30));
            rightAntennaTip.rotateX(gfx.MathUtils.degreesToRadians(90));
            rightAntennaTip.material.setColor(new gfx.Color(0, 0, 0));
            rightAntenna.children.push(rightAntennaTip);
            bone.transform.add(rightAntennaTip);

            // Left Eye
            const leftEye = new gfx.SphereMesh(0.02);
            leftEye.translate(new gfx.Vector3(-0.04, 0.1, 0.05));
            leftEye.material.setColor(new gfx.Color(0, 0, 0))
            headBone.children.push(leftEye);
            bone.transform.add(leftEye);
            
            // Right Eye
            const rightEye = new gfx.SphereMesh(0.02);
            rightEye.translate(new gfx.Vector3(0.04, 0.1, 0.05));
            rightEye.material.setColor(new gfx.Color(0, 0, 0))
            headBone.children.push(rightEye);
            bone.transform.add(rightEye);

            // Mouth
            const mouth = new gfx.SphereMesh(0.03);
            mouth.translate(new gfx.Vector3(0, -0.14, 0.12));
            mouth.scale.multiply(new gfx.Vector3(1.3, 1, 1));
            mouth.material.setColor(antColor)
            headBone.children.push(mouth);
            bone.transform.add(mouth);
        }
        else if (bone.name == 'lowerneck') {
            // Lower Neck
            const lowerNeck = new gfx.BoxMesh(0.02, 0.3, 0.02);
            lowerNeck.translate(new gfx.Vector3(0, 0.1, -0.05));
            lowerNeck.rotateX(gfx.MathUtils.degreesToRadians(30));
            lowerNeck.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(lowerNeck);
        }
        else if (bone.name == 'thorax') { 
            // Thorax
            const thorax = new gfx.SphereMesh(0.1);
            thorax.material.setColor(antColor);
            thorax.translate(new gfx.Vector3(0, 0.07, -0.07));
            bone.transform.add(thorax);
        }
        else if (bone.name == 'upperback') { 
            // Upper Back
            const upperBack = new gfx.SphereMesh(0.1);
            upperBack.material.setColor(antColor);
            upperBack.translate(new gfx.Vector3(0, 0.05, -0.08));
            bone.transform.add(upperBack);
        }
        else if (bone.name == 'lowerback') { 
            // Lower Back
            const lowerBack = new gfx.SphereMesh(0.1);
            lowerBack.material.setColor(antColor);
            lowerBack.scale.multiply(new gfx.Vector3(1.5,2.8,1.5));
            lowerBack.rotateX(gfx.MathUtils.degreesToRadians(25))
            lowerBack.translate(new gfx.Vector3(0, -0.15, -0.12));
            bone.transform.add(lowerBack);
        }
        else if (bone.name == 'lfemur') {
            // Left Femur
            const leftFemur = new gfx.BoxMesh(0.02, 0.45, 0.02);
            leftFemur.translate(new gfx.Vector3(-0.08, 0.25, -0.1));
            leftFemur.rotateX(gfx.MathUtils.degreesToRadians(-10));
            leftFemur.rotateZ(gfx.MathUtils.degreesToRadians(20));
            leftFemur.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(leftFemur);
        }
        else if (bone.name == 'rfemur') {
            // Right Femur
            const rightFemur = new gfx.BoxMesh(0.02, 0.45, 0.02);
            rightFemur.translate(new gfx.Vector3(0.08, 0.25, -0.1));
            rightFemur.rotateX(gfx.MathUtils.degreesToRadians(-10));
            rightFemur.rotateZ(gfx.MathUtils.degreesToRadians(-20));
            rightFemur.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rightFemur);
        }
        else if (bone.name == 'ltibia') {
            // Left Tibia
            const leftTibia = new gfx.BoxMesh(0.02, 0.4, 0.02);
            leftTibia.translate(new gfx.Vector3(-0.05, 0.2, -0.0));
            leftTibia.rotateX(gfx.MathUtils.degreesToRadians(-25));
            leftTibia.rotateZ(gfx.MathUtils.degreesToRadians(20));
            leftTibia.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(leftTibia);
        }
        else if (bone.name == 'rtibia') {
            // Right Tibia
            const rightTibia = new gfx.BoxMesh(0.02, 0.4, 0.02);
            rightTibia.translate(new gfx.Vector3(0.05, 0.2, -0.0));
            rightTibia.rotateX(gfx.MathUtils.degreesToRadians(-25));
            rightTibia.rotateZ(gfx.MathUtils.degreesToRadians(-20));
            rightTibia.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rightTibia);
        }
        else if (bone.name == 'lfoot') {
            // Left Foot
            const leftFoot = new gfx.BoxMesh(0.04, 0.02, 0.1);
            leftFoot.translateZ(0.05);
            leftFoot.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(leftFoot);
        }
        else if (bone.name == 'rfoot') {
            // Right Foot
            const rightFoot = new gfx.BoxMesh(0.04, 0.02, 0.1);
            rightFoot.translateZ(0.05);
            rightFoot.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rightFoot);
        }else if (bone.name == 'lclavicle') {
            // Left Clavicle
            const leftClavicle = new gfx.BoxMesh(0.02, 0.25, 0.02);
            leftClavicle.translate(new gfx.Vector3(-0.06, 0, -0.1));
            leftClavicle.rotateZ(gfx.MathUtils.degreesToRadians(-75));
            leftClavicle.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(leftClavicle);
        }
        else if (bone.name == 'rclavicle') {
            // Right Clavicle
            const rightClavicle = new gfx.BoxMesh(0.02, 0.25, 0.02);
            rightClavicle.translate(new gfx.Vector3(0.06, 0, -0.1));
            rightClavicle.rotateZ(gfx.MathUtils.degreesToRadians(75));
            rightClavicle.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rightClavicle);
        }
        else if (bone.name == 'lhumerus') {
            // Left Humerus
            const leftHumerus = new gfx.BoxMesh(0.35, 0.02, 0.02);
            leftHumerus.translate(new gfx.Vector3(-0.1, -0.02, -0.1));
            leftHumerus.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(leftHumerus);
        }
        else if (bone.name == 'rhumerus') {
            // Right Humerus
            const rightHumerus = new gfx.BoxMesh(0.35, 0.02, 0.02);
            rightHumerus.translate(new gfx.Vector3(0.1, -0.02, -0.1));
            rightHumerus.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rightHumerus);
        }
        else if (bone.name == 'lhand') {
            // Left Hand
            const leftHand = new gfx.BoxMesh(0.25, 0.02, 0.02);
            leftHand.translate(new gfx.Vector3(-0.15, -0.02, -0.1));
            leftHand.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(leftHand);
        }
        else if (bone.name == 'rhand') {
            // Right Hand
            const rightHand = new gfx.BoxMesh(0.25, 0.02, 0.02);
            rightHand.translate(new gfx.Vector3(0.15, -0.02, -0.1));
            rightHand.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rightHand);
        }
        else if (bone.name == 'lfingers') {
            // Left Fingers
            const leftFingers = new gfx.BoxMesh(0.02, 0.04, 0.1);
            leftFingers.rotateY(gfx.MathUtils.degreesToRadians(30));
            leftFingers.translate(new gfx.Vector3(0.02,0,-0.1));
            leftFingers.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(leftFingers);
        }
        else if (bone.name == 'rfingers') {
            // Right Fingers
            const rightFingers = new gfx.BoxMesh(0.02, 0.04, 0.1);
            rightFingers.rotateY(gfx.MathUtils.degreesToRadians(-30));
            rightFingers.translate(new gfx.Vector3(0.02,0,-0.1));
            rightFingers.material.setColor(new gfx.Color(0, 0, 0));
            bone.transform.add(rightFingers);
        }
        
        // TO DO (PART 1): Recursively call this function for each of the bone's children
        bone.children.forEach((rootBone: Bone) => {
            this.createMeshesRecursive(rootBone)
        });
    }

    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = gfx.Vector3.copy(this.overlayQueue[0].frames[overlayFrame].rootPosition);
                relativeOverlayPosition.subtract(this.overlayPose.rootPosition);

                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);

                relativeOverlayPosition.lerp(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }

    // Entry function for the recursive call
    toggleAxes(showAxes: boolean): void
    {
        this.toggleAxesRecursive(this.skeleton, showAxes);
    }

    private toggleAxesRecursive(object: gfx.Transform3, showAxes: boolean): void
    {
        // Set the visibility of the coordinate axes
        if(object instanceof gfx.Axes3)
        {
            object.material.visible = showAxes;
        }
        // Set the visibility of all materials that are not coordinate axes
        else if(object instanceof gfx.Mesh || object instanceof gfx.MeshInstance || object instanceof gfx.Line3)
        {
            object.material.visible = !showAxes;
        }

        // Call the function recursively for each child node
        object.children.forEach((child: gfx.Transform3) => {
            this.toggleAxesRecursive(child, showAxes);
        });
    }
}